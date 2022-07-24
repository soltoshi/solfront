import { collection, setDoc, doc } from "firebase/firestore";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'merchants';
const COLLECTION_PREFIX = 'acct';

const createMerchant = async (name: String) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    const docRef = await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      name: name,
    });
    console.log("Created merchant with id", generatedId);
  } catch (e) {
    console.error("Error creating merchant: ", e);
  }
}

export {
  createMerchant,
};
