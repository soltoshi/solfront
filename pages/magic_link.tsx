import { Heading, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { getAdditionalUserInfo, getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useEffect } from "react";
import app from "../state/firebase";

const MagicLink: NextPage = () => {

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    const auth = getAuth(app);
    console.log("[magic_link] window location", window.location.href);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          console.log('[magic_link] successfully signed in with email link', {
            email,
            isNewUser: getAdditionalUserInfo(result).isNewUser,
          });

        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error('[magic_link] error doing magic link auth', error);
        });
    }
  })

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          Logging in with magic link
        </Heading>
      </VStack>
    </>
  )
}

export default MagicLink;
