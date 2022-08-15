import { setDoc, doc, getDocs, collection, query, where, orderBy, updateDoc } from "firebase/firestore";
import db from "./database";
import { loadPaymentLink } from "./paymentLink";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'payments';
const COLLECTION_PREFIX = 'pymt';

export enum PaymentState {
  Acquired,
  Processing,
  Fulfilled,
}

export enum Currency {
  SOL,
  USDC,
}

export type CreatePaymentParams = {
  paymentLink: string;
  created: number;

  amount: number;
  currency: Currency;

  walletAddress: string;
  txId: string;

  state: PaymentState;

  paymentDetails: object;
}

const createPayment = async ({
  paymentLink,
  created,
  walletAddress,
  amount,
  txId,
  state,
  currency,
  paymentDetails={},
}: CreatePaymentParams) => {

  // idempotency check
  const existingPayment = await getPaymentByTransactionId({transactionId: txId});
  if (existingPayment.length > 0) {
    console.error("Payment already exists for transaction id", {
      payment: existingPayment[0].id,
      txId,
    });
    return;
  }

  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);

    // we fetch the merchant from the payment link
    const loadedPaymentLink = await loadPaymentLink({linkId: paymentLink});
    const merchant = loadedPaymentLink.merchant;

    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      merchant,
      payment_link: paymentLink,
      created,
      wallet_address: walletAddress,
      amount,
      transaction_id: txId,
      state,
      currency,
      payment_details: paymentDetails,
    });
    console.log("Created payment with id", generatedId);

    return generatedId;
  } catch (e) {
    console.error("Error creating payment: ", e);
  }
}

const updatePayment = async ({id, state, circle_payout_id}) => {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    state,
    circle_payout_id
  });
  console.log("Updated payment with id", id);
}

const getPaymentByTransactionId = async({transactionId}) => {
  try {
    const filters = [where("transaction_id", "==", transactionId)];
    const q = query(collection(db, COLLECTION_NAME), ...filters);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot;
    });
  } catch (e) {
    console.error("Error loading payments with tx id", e);
  }
}

const getPayments = async({merchant, paymentLink, orderByState=false}) => {
  try {
    const filters = [where("merchant", "==", merchant)];
    if (paymentLink && paymentLink.length > 0) {
      filters.push(where("payment_link", "==", paymentLink));
    }
    if (orderByState) {
      filters.push(orderBy("state", "asc"));
    }
    const q = query(collection(db, COLLECTION_NAME), ...filters);
    console.log(`loading payments for:`, {merchant, paymentLink});

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot;
    });
  } catch (e) {
    console.error("Error loading payments: ", e);
  }
}

export {
  createPayment,
  getPayments,
  updatePayment,
};
