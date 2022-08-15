import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// import fetch from "node-fetch";

// @ts-nocheck

admin.initializeApp();


// // TODO: make these environment variables
// const CIRCLE_API_KEY = "QVBJX0tFWTo2ODgxYzFlMGM5ZDc3ZDNjY2IzYmVkN2I2ZWZjZjc1ZTphOWZkNTY4YjVhOGQ1ZDU4Nzg4ZTRiZjAwNjRlMWE2MQ=="
// const MASTER_WALLET_ID = "1001066014"

// const CIRCLE_API_ENDPOINT = "https://api-sandbox.circle.com"

// // HTTP helpers

// async function makeHttpRequest(url: any, method: any, data: any) {
//   const opts = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${CIRCLE_API_KEY}`,
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//   } as any;

//   if (data) {
//     opts['body'] = JSON.stringify(data);
//   }

//   const response = await fetch(url, opts);
//   return response;
// }

// async function post(path= '', data = {}) {
//   const url = `${CIRCLE_API_ENDPOINT}${path}`;
//   const response = await makeHttpRequest(url, 'POST', data);
//   return response.json();
// }

// async function get(path = '') {
//   const url = `${CIRCLE_API_ENDPOINT}${path}`
//   const response = await makeHttpRequest(url, 'GET', null);
//   return response.json();
// }

// // Circle API functions

// async function createBankAccount(data={}) {
//   const response = await post('/v1/banks/wires', {
//     idempotencyKey: "6ae62bf2-bd71-49ce-a599-165ffcc33680",
//     beneficiaryName: "John Smith",
//     accountNumber: "123456789",
//     routingNumber: "021000021",
//     billingDetails: {
//       name: "John Smith",
//       city: "Boston",
//       country: "US",
//       line1: "1 Main Street",
//       district: "MA",
//       postalCode: "02201"
//     },
//     bankAddress: {
//       country: "US",
//     },
//   })

//   console.log("Create bank account response", response);
//   return response;
// }

// async function sendPayout(data: any) {
//   const response = await post('/v1/payouts', {
//     idempotencyKey: "ff9d668a-ccde-48c3-82fd-8deb2a6f7c28",
//     destination: {
//       type: "wire",
//       id: data.bankAccountId,
//     },
//     amount: {
//       currency: "USD",
//       amount: "0.00",
//     },
//     metadata: {
//       beneficiaryEmail: "john.smith@email.com"
//     }
//   })

//   console.log("Send payout response", response);
//   return response;
// }

// Cloud functions

exports.sendPayout = functions.firestore.document("/payment/{paymentId}")
    .onCreate((snap, context) => {
      const original = snap.data().original;
      const paymentId = context.params.paymentId;

      functions.logger.log("> creating payout for", paymentId, JSON.stringify(original, null, 2));

      // get the merchant to get the bank account id
      // construct circle send payout request
      // set payout id on payment
      // update payment state
      // TODO: function that checks payout state everytime a payment is queried

      // sendPayout({

      // })

    // snap.ref.set({payoutId}, {merge: true});
    });

exports.makeBankAccount = functions.firestore.document("/merchant/{merchantId}")
  .onCreate((snap, context) => {
    // get the merchant id
    // create a circle bank account
    // set the bank account id on the merchant document
  });