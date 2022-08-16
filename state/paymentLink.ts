import { setDoc, doc, getDocs, collection, getDoc, query, where } from "firebase/firestore";
import generatePaymentLinkSlug from "../util/generate_link_slug";
import db from "./database";
import generateDocumentId from "./util/generateDocumentId";

const COLLECTION_NAME = 'paymentlinks';
const COLLECTION_PREFIX = 'pymtlink';
const PAYMENT_LINK_DOMAIN = 'pay.solfront.app';

interface CreatePaymentLinkParams {
  merchant: string;
  productCurrency: string;
  productName: string;
  productPrice: number;
  collectDetails: {
    email: boolean;
    phone: boolean;
    shippingAddress: boolean;
  };
}

interface GetPaymentLinkParams {
  linkId: string;
}

const createPaymentLink = async ({
  merchant,
  productCurrency,
  productName,
  productPrice,
  collectDetails,
}: CreatePaymentLinkParams) => {
  if (!merchant) {
    throw new Error("Must have merchant set to create payment link");
  }

  try {
    const generatedId = generateDocumentId(COLLECTION_PREFIX);
    await setDoc(doc(db, COLLECTION_NAME, generatedId), {
      merchant: merchant,
      productCurrency: productCurrency,
      productName: productName,
      // TODO: normalize product price
      productPrice: productPrice,
      link: `${PAYMENT_LINK_DOMAIN}/${generatePaymentLinkSlug()}`,
      collectDetails: collectDetails,
    });
    console.log("Created payment link with id", generatedId);
  } catch (e) {
    console.error("Error creating payment link: ", e);
  }
}

const loadPaymentLink = async ({linkId}: GetPaymentLinkParams) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, linkId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.error(`Error loading ${linkId}: `, e);
  }
}

const getPaymentLinkBySlug = async ({slug}) => {
  const linkWithSlug = `${PAYMENT_LINK_DOMAIN}/${slug}`;
  try {
    console.log(`finding link with slug ${linkWithSlug}`);
    const q = query(collection(db, COLLECTION_NAME), where("link", "==", linkWithSlug));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot;
    });
  } catch (e) {
    console.error(`Error fetching payment link for ${linkWithSlug}: `, e)
  }
}

const getPaymentLinks = async({merchant}) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("merchant", "==", merchant))
    console.log(`loading payment links for merchant: ${merchant}`);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnapshot) => {
      return docSnapshot;
    });
  } catch (e) {
    console.error("Error loading all payment links: ", e);
  }
}

export {
  createPaymentLink,
  loadPaymentLink,
  getPaymentLinks,
  getPaymentLinkBySlug,
};
