import { createContext, useContext, useState, FC, ReactNode, useEffect } from "react";
import { getMerchantByAuthUserId } from "../state/merchant";

interface IAuthContext {
  authUid?: string,
  setAuthUid?: (authUid: string) => void,
  merchantId?: string,
}

const AuthContext = createContext<IAuthContext>({});

export const AuthContextProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [authUid, setAuthUid] = useState<string>(null);
  const [merchantId, setMerchantId] = useState<string>(null);

  // This should run every time authUid gets set so that the rest of our app can
  // easily retrieve the authenticated merchant account
  useEffect(() => {
    const getMerchant = async () => {
      if (merchantId && merchantId.length > 0) {
        console.log('Returning stored merchant from provider', merchantId);
        return merchantId;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}