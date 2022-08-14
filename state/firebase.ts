// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

import { getApp, getApps, initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export {
  firebaseConfig
};
export default app;
