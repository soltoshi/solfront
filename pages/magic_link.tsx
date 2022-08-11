import { Box, Spinner, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { getAdditionalUserInfo, getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "../state/firebase";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";

const MagicLink: NextPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {setAuthUid} = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    const auth = getAuth(app);
    if (isSignInWithEmailLink(auth, window.location.href) && isLoading) {
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
          const isNewUser = getAdditionalUserInfo(result).isNewUser;
          console.log('[magic_link] successfully signed in with email link', {
            email,
            isNewUser: isNewUser,
          });

          setAuthUid(result.user.uid);

          const nextPage = isNewUser ? '/create_merchant' : '/dashboard';
          router.push(nextPage);

          setIsLoading(false);
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error('[magic_link] error doing magic link auth', error);
        });
    }
  }, [])

  return (
    <>
      <VStack>
        {
          isLoading ?
            <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
              <Spinner/>
            </Box> : <></>
        }
      </VStack>
    </>
  )
}

export default MagicLink;
