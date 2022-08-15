import fetch from "node-fetch";

// TODO: make these environment variables
const CIRCLE_API_KEY = "QVBJX0tFWTo2ODgxYzFlMGM5ZDc3ZDNjY2IzYmVkN2I2ZWZjZjc1ZTphOWZkNTY4YjVhOGQ1ZDU4Nzg4ZTRiZjAwNjRlMWE2MQ=="
const MASTER_WALLET_ID = "1001066014"

const CIRCLE_API_ENDPOINT = "https://api-sandbox.circle.com"

// HTTP helpers

async function makeHttpRequest(url, method, data=null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CIRCLE_API_KEY}`,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  if (data) {
    opts['body'] = JSON.stringify(data);
  }

  const response = await fetch(url, opts);
  return response.json();
}

async function post(path= '', data = {}) {
  const url = `${CIRCLE_API_ENDPOINT}${path}`;
  const response = await makeHttpRequest(url, 'POST', data);
  return response.json();
}

async function get(path = '') {
  const url = `${CIRCLE_API_ENDPOINT}${path}`
  const response = await makeHttpRequest(url, 'GET');
  return response.json();
}

// API functions

async function createBankAccount(data={}) {
  const response = await post('/v1/banks/wires', {
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
      postalCode: "02201"
    },
    bankAddress: {
      country: "US",
    },
  })

  console.log("Create bank account response", response);
  return response.json();
}

async function sendPayout(data) {
  const response = await post('/v1/payouts', {
    idempotencyKey: "ff9d668a-ccde-48c3-82fd-8deb2a6f7c28",
    destination: {
      type: "wire",
      id: data.bankAccountId,
    },
    amount: {
      currency: "USD",
      amount: "1.00"
    },
    metadata: {
      beneficiaryEmail: "john.smith@email.com"
    }
  })

  console.log("Send payout response", response);
  return response.json();
}

async function getPayout(id) {
  const response = await get(`/v1/payouts/${id}`);
  console.log("Get payout response", response);
  return response.json();
}

async function listPayouts() {
  const response = await get(`/v1/payouts`);
  console.log("List payouts response", response);
  return response.json();
}

async function listBalances() {
  const response = await get('/v1/businessAccount/balances');
  console.log("List balances response", JSON.stringify(response));
  return response.json();
}

async function transferOut({destinationAddress, destinationChain}) {
  const response = await post('/v1/transfers', {
    idempotencyKey: "4ca72ac7-5217-49bb-bbe6-e8dcb4c53c25",
    source: {
      type: "wallet",
      id: MASTER_WALLET_ID,
    },
    destination: {
      type: "blockchain",
      address: destinationAddress,
      chain: destinationChain,
    },
    amount: {
      amount: "0.10",
      currency: "USD"
    }
  })

  console.log("Transfer out response", JSON.stringify(response));
  return response.json();
}

async function listTransfers() {
  const response = await get('/v1/transfers');
  console.log("List transfers response", response);
  return response.json();
}

async function getTransfer(id) {
  const response = await get(`/v1/transfers/${id}`);
  console.log("Get transfer response", JSON.stringify(response));
  return response.json();
}

// TODO: send USDC in
// TODO: get wallet balance

const CircleApi = {
  createBankAccount,
  sendPayout,
  getPayout,
  listPayouts,
  listBalances,
  transferOut,
  listTransfers,
  getTransfer,
};

export default CircleApi;
