/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// import fetch from "node-fetch";

// @ts-nocheck

admin.initializeApp();


// TODO: make these environment variables
const CIRCLE_API_KEY = "QVBJX0tFWTo2ODgxYzFlMGM5ZDc3ZDNjY2IzYmVkN2I2ZWZjZjc1ZTphOWZkNTY4YjVhOGQ1ZDU4Nzg4ZTRiZjAwNjRlMWE2MQ==";
// const MASTER_WALLET_ID = "1001066014";

const CIRCLE_API_ENDPOINT = "https://api-sandbox.circle.com";

// HTTP helpers

async function makeHttpRequest(url: any, method: any, data: any) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CIRCLE_API_KEY}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  } as any;

  if (data) {
    opts["body"] = JSON.stringify(data);
  }

  const response = await fetch(url, opts);
  return response.json();
}

async function post(path= "", data = {}) {
  const url = `${CIRCLE_API_ENDPOINT}${path}`;
  const response = await makeHttpRequest(url, "POST", data);
  return response;
}

// async function get(path = "") {
//   const url = `${CIRCLE_API_ENDPOINT}${path}`;
//   const response = await makeHttpRequest(url, "GET", null);
//   return response;
// }

// Circle API functions

async function createBankAccount(data={}) {
  const response = await post("/v1/banks/wires", {
    idempotencyKey: "6ae62bf2-bd71-49ce-a599-165ffcc33680",
    beneficiaryName: "John Smith",
    accountNumber: "123456789",
    routingNumber: "021000021",
    billingDetails: {
      name: "John Smith",
      city: "Boston",
      country: "US",
      line1: "1 Main Street",
      district: "MA",
      postalCode: "02201",
    },
    bankAddress: {
      country: "US",
    },
  });

  return response;
}

async function sendPayout(data: any) {
  const response = await post("/v1/payouts", {
    idempotencyKey: "ff9d668a-ccde-48c3-82fd-8deb2a6f7c28",
    destination: {
      type: "wire",
      id: data.bankAccountId,
    },
    amount: {
      currency: "USD",
      amount: "0.00",
    },
    metadata: {
      beneficiaryEmail: "john.smith@email.com",
    },
  });

  return response;
}

// Cloud functions

exports.sendPayout = functions.firestore.document("/payment/{paymentId}")
    .onCreate(async (snap, context) => {
      const paymentId = context.params.paymentId;
      functions.logger.log("creating Circle payout for payment", paymentId);

      // get the merchant to get the bank account id
      const merchantId = snap.data().merchant;
      const merchant = await admin.firestore().doc(`merchants/${merchantId}`).get();
      const circleBankAccountId = merchant.data()?.circleBankAccountId;
      if (!circleBankAccountId) {
        functions.logger.error("could not get merchant's Circle bank account", {merchantId});
        return;
      }
      functions.logger.log("paying out to merchant's Circle bank account", {merchantId, circleBankAccountId});

      // construct circle send payout request
      const sendPayoutResponse = await sendPayout({bankAccountId: circleBankAccountId});
      functions.logger.log("sent Circle payout", JSON.stringify(sendPayoutResponse));

      // set payout id on payment, update state
      const circlePayoutId = sendPayoutResponse.data.id;
      if (!circlePayoutId) {
        functions.logger.error("failed to create Circle payout", {paymentId});
        return;
      }

      // State enum 1 == Processing state
      const newPaymentState = 1;

      await snap.ref.set({
        circlePayoutId,
        state: newPaymentState,
      }, {merge: true});
      functions.logger.log("set Circle payout id on payment, updated payment state", {paymentId, circlePayoutId, newPaymentState});

      return;
    });

exports.makeBankAccount = functions.firestore.document("/merchant/{merchantId}")
    .onCreate(async (snap, context) => {
      // get the merchant id
      const merchantId = context.params.merchantId;
      functions.logger.log("creating Circle bank account for merchant", merchantId);

      // create a circle bank account
      const createBankAccountResponse = await createBankAccount({});
      functions.logger.log("created Circle bank account", JSON.stringify(createBankAccountResponse));

      // set the bank account id on the merchant document
      const circleBankAccountId = createBankAccountResponse.data.id;
      await snap.ref.set({
        circleBankAccountId,
      }, {merge: true});
      functions.logger.log("set bank account on merchant doc", {circleBankAccountId});

      return;
    });

// TODO: on payment query - should see if state needs to be updated
