import { setDoc, doc } from "firebase/firestore";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'merchants';
const COLLECTION_PREFIX = 'acct';

interface CreateMerchantParams {
  name: String;
  email: String;
}

const createMerchant = async ({name, email}) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
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
