import { setDoc, doc, getDocs, collection, getDoc, query, where } from "firebase/firestore";
import generatePaymentLinkSlug from "../util/generate_link_slug";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'payments';
const COLLECTION_PREFIX = 'pymt';

interface CreatePaymentParams {
  merchant: string;
  paymentLink: string;
  created: number;

  walletAddress: string;
  amount: number;
  txId: string;

  // TODO: these should be enums
  state: string;
  currency: string;

  // TODO: additional details
  paymentDetails: object;
}

const createPayment = async ({
  merchant,
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
    console.log(`loading payments for merchant: ${merchant}`);

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
