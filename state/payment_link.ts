import { collection, addDoc } from "firebase/firestore";
import db from "./database";

const createPaymentLink = async (
  merchant: String,
  productCurrency: String,
  productName: String,
  productPrice: Number,
) => {
  try {
    // TODO: use a constant ref to the collection name
    const docRef = await addDoc(collection(db, "paymentlinks"), {
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
