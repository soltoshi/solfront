import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://solfront.app',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  // dynamicLinkDomain: 'solfront.app',
};

const sendSignInLinkToMerchantEmail = async (email: string) => {
  console.log('[auth] action url is: ', actionCodeSettings.url);
  // console.log('[auth] dynamic link domain is: ', actionCodeSettings.dynamicLinkDomain);
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
    console.log('[auth] successfully sent login email magic link to: ', email);
  } catch (error) {
    console.error('[auth] failed to send login email to user', error);
  }
}

export {
  sendSignInLinkToMerchantEmail
}
