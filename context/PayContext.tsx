import { createContext, useContext, useState, FC, ReactNode } from "react";

interface IPayContext {
  price?: number,
  setPrice?: (price: number) => void,
  paymentLink?: string,
  setPaymentLink?: (paymentLink: string) => void,
}

const PayContext = createContext<IPayContext>({});

export const PayContextProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [price, setPrice] = useState<number>(0);
  const [paymentLink, setPaymentLink] = useState<string>(null);

  return (
    <PayContext.Provider
      value={{
        price,
        paymentLink,
        setPrice,
        setPaymentLink
      }}
    >
      {children}
    </PayContext.Provider>
  );
};

export function usePayContext() {
  return useContext(PayContext);
}
