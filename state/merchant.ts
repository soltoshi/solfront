import { collection, addDoc } from "firebase/firestore";
import db from "./database";

const COLLECTION_NAME = 'merchants';

const createMerchant = async (name: String) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
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
