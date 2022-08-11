import { setDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'merchants';
const COLLECTION_PREFIX = 'acct';

interface CreateMerchantParams {
  name: string;
  email: string;
  bankAccountNumber: string;

  authUid: string;
}

const createMerchant = async ({name, email, bankAccountNumber, authUid}: CreateMerchantParams) => {
  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      name,
      email,
      bank_account_number: bankAccountNumber,
      auth_user_id: authUid,
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
      return docSnapshot;
    });
  } catch (e) {
    console.error(`Error fetching merchant with auth user id ${authUserId}: `, e)
  }
}

export {
  createMerchant,
  getMerchantByAuthUserId,
};
