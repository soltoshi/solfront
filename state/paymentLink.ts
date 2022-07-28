import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import generatePaymentLinkSlug from "../util/generate_link_slug";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'paymentlinks';
const COLLECTION_PREFIX = 'pymtlink';
const PAYMENT_LINK_DOMAIN = 'pay.solfront.app';

interface CreatePaymentLinkParams {
  merchant: String;
  productCurrency: String;
  productName: String;
  productPrice: Number;
}

const createPaymentLink = async ({
  merchant,
  productCurrency,
  productName,
  productPrice,
}: CreatePaymentLinkParams) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      merchant: merchant,
      productCurrency: productCurrency,
      productName: productName,
      // TODO: normalize product price
      productPrice: productPrice,
      link: `${PAYMENT_LINK_DOMAIN}/${generatePaymentLinkSlug()}`,
    });
    console.log("Created payment link with id", generatedId);
  } catch (e) {
    console.error("Error creating payment link: ", e);
  }
}

const getPaymentLinks = async() => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot.data();
    });
  } catch (e) {
    console.error("Error loading all payment links: ", e);
  }
}

export {
  createPaymentLink,
  getPaymentLinks,
};
