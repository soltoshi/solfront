import { useRouter } from "next/router";
import { createContext, useContext, useState, FC, ReactNode, useEffect } from "react";
import { getMerchantByAuthUserId } from "../state/merchant";

interface IAuthContext {
  authUid?: string,
  setAuthUid?: (authUid: string) => void,
  merchantId?: string,
  isLoggedIn?: () => boolean;
  handleSignOut?: () => void;
}

const AuthContext = createContext<IAuthContext>({});

export const AuthContextProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [authUid, setAuthUid] = useState<string>(null);
  const [merchantId, setMerchantId] = useState<string>(null);

  const router = useRouter();

  const isLoggedIn = () => {
    return !!authUid;
  }

  const handleSignOut = () => {
    // clear the auth uid
    setAuthUid(null);
    // clear the merchant id
    setMerchantId(null);
    // clear the cookie
    localStorage.removeItem("solfrontAuthUid");
    // route to the landing page
    router.push('/');
  }

  // This should run every time authUid gets set so that the rest of our app can
  // easily retrieve the authenticated merchant account
  useEffect(() => {
    const getMerchant = async () => {
      if (merchantId && merchantId.length > 0) {
        console.log('Returning stored merchant from provider', merchantId);
        return merchantId;
      }

      // See if we already have an authUid
      if (!authUid) {
        // It's possible that it's stored in the browser from a previous auth
        // session
        const maybeAuthUid = localStorage.getItem("solfrontAuthUid");
        console.log("[auth] checking if auth is in local storage, found:", maybeAuthUid);

        // We route to the auth page if there's nothing in local storage as well
        if (!maybeAuthUid) {
          console.log("[auth] no auth found, routing to auth page");
          router.push('/auth');
        }

        setAuthUid(maybeAuthUid);
      }

      const merchants = await getMerchantByAuthUserId({authUserId: authUid});
      if (merchants.length == 0) {
        return null;
      } else {
        const merchantId = merchants[0].id;
        console.log('Found merchant for authenticated user', merchantId);
        setMerchantId(merchantId);
        return merchantId;
      }
    }
    getMerchant();
  }, [authUid]);

  return (
    <AuthContext.Provider
      value={{
        authUid,
        setAuthUid,
        merchantId,
        isLoggedIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}
