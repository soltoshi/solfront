import { setDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'merchants';
const COLLECTION_PREFIX = 'acct';

interface CreateMerchantParams {
  name: String;
  email: String;
  bankAccountNumber: String;
}

const createMerchant = async ({name, email, bankAccountNumber}: CreateMerchantParams) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      name,
      email,
      bankAccountNumber,
    });
    console.log("Created merchant with id", generatedId);
  } catch (e) {
    console.error("Error creating merchant: ", e);
  }
}

const getMerchantByAuthUserId = async ({authUserId}) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("auth_user_id", "==", authUserId));
    console.log(`finding merchant with auth user id ${authUserId}`);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot.data();
    });
  } catch (e) {
    console.error(`Error fetching merchant with auth user id ${authUserId}: `, e)
  }
}

export {
  createMerchant,
  getMerchantByAuthUserId,
};
