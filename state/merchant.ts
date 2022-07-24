import { collection, addDoc } from "firebase/firestore";
import db from "./database";

const createMerchant = async (name: String) => {
  try {
    const docRef = await addDoc(collection(db, "merchant"), {
      name: name,
    });
    console.log("Created merchant with id", docRef.id);
  } catch (e) {
    console.error("Error creating merchant: ", e);
  }
}

export {
  createMerchant,
};
