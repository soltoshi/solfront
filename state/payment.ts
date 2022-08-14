import { setDoc, doc, getDocs, collection, getDoc, query, where } from "firebase/firestore";
import generatePaymentLinkSlug from "../util/generate_link_slug";
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

  // TODO: additional details
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
  } catch (e) {
    console.error("Error creating payment: ", e);
  }
}

const getPayments = async({merchant, paymentLink}) => {
  try {
    const filters = [where("merchant", "==", merchant)];
    if (paymentLink && paymentLink.length > 0) {
      filters.push(where("payment_link", "==", paymentLink));
    }
    const q = query(collection(db, COLLECTION_NAME), ...filters);
    console.log(`loading payments for:`, {merchant, paymentLink});

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot.data();
    });
  } catch (e) {
    console.error("Error loading payments: ", e);
  }
}

export {
  createPayment,
  getPayments,
};
