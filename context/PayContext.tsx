import { useWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo } from "@solana/web3.js";
import { createContext, useContext, useState, FC, ReactNode, useEffect } from "react";
import * as Payment from "../state/payment";
import { getCurrentTime } from "../state/util/time";

interface IPayContext {
  price?: number,
  setPrice?: (price: number) => void,

  paymentLink?: string,
  setPaymentLink?: (paymentLink: string) => void,

  paymentLinkSlug?: string,
  setPaymentLinkSlug?: (paymentLink: string) => void,

  product?: string,
  setProduct?: (product: string) => void,

  setTxIdAndCreatePayment?: (txId: string) => void,
}

const PayContext = createContext<IPayContext>({});

export const PayContextProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [price, setPrice] = useState<number>(0);
  const [paymentLink, setPaymentLink] = useState<string>(null);
  const [product, setProduct] = useState<string>(null);
  const [txId, setTxId] = useState<string>('');

  const {publicKey} = useWallet();

  const setTxIdAndCreatePayment = async (txId: string) => {
    setTxId(txId);

    const args = {
      paymentLink,
      created: getCurrentTime(),
      amount: price,
      currency: Payment.Currency.SOL,
      walletAddress: publicKey.toString(),
      txId: txId,
      state: Payment.PaymentState.Acquired,
    } as Payment.CreatePaymentParams;

    console.log("[pay-context] creating payment with args", JSON.stringify(args));

    await Payment.createPayment(args);
  };

  return (
    <PayContext.Provider
      value={{
        price,
        paymentLink,
        setPrice,
        setPaymentLink,
        product,
        setProduct,
        setTxIdAndCreatePayment,
      }}
    >
      {children}
    </PayContext.Provider>
  );
};

export function usePayContext() {
  return useContext(PayContext);
}
