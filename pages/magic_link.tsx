import { Box, Heading, Spinner, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { getAdditionalUserInfo, getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "../state/firebase";
import router from "next/router";
import { getMerchantByAuthUserId } from "../state/merchant";
import { useAuthContext } from "../context/AuthContext";

const MagicLink: NextPage = () => {

  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {setAuthUid} = useAuthContext();

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
          setEmail(email);
          const isNewUser = getAdditionalUserInfo(result).isNewUser;
          setIsNewUser(isNewUser);
          setIsLoading(false);
          console.log('[magic_link] successfully signed in with email link', {
            email,
            isNewUser: isNewUser,
          });

          setAuthUid(result.user.uid);

          // TODO: set values on an auth provider of sorts so that
          // create_merchant has user ID to map to a merchant
          if (isNewUser) {
            router.push('/create_merchant');
          } else {
            router.push('/dashboard')
          }
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.error('[magic_link] error doing magic link auth', error);
        });
    }
  }, [email])

  return (
    <>
      <VStack>
        {
          isLoading ?
           <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
            <Spinner/>
           </Box> :
           <Heading fontSize={'2xl'}>
            Welcome {email}!
          </Heading>
        }
      </VStack>
    </>
  )
}

export default MagicLink;
