import { collection, setDoc, doc } from "firebase/firestore";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'paymentlinks';
const COLLECTION_PREFIX = 'pymtlink';

const createPaymentLink = async (
  merchant: String,
  productCurrency: String,
  productName: String,
  productPrice: Number,
) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    const docRef = await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      merchant: merchant,
      productCurrency: productCurrency,
      productName: productName,
      productPrice: productPrice,
    });
    console.log("Created payment link with id", generatedId);
  } catch (e) {
    console.error("Error creating payment link: ", e);
  }
}

export {
  createPaymentLink,
};
