import { collection, addDoc } from "firebase/firestore";
import db from "./database";

const COLLECTION_NAME = 'paymentlinks';

const createPaymentLink = async (
  merchant: String,
  productCurrency: String,
  productName: String,
  productPrice: Number,
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      // TODO: generate ID
      merchant: merchant,
      productCurrency: productCurrency,
      productName: productName,
      productPrice: productPrice,
    });
    console.log("Created payment link with id", docRef.id);
  } catch (e) {
    console.error("Error creating payment link: ", e);
  }
}

export {
  createPaymentLink,
};
