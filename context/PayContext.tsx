import { useWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo } from "@solana/web3.js";
import { createContext, useContext, useState, FC, ReactNode, useEffect } from "react";
import * as Payment from "../state/payment";
import { getCurrentTime } from "../state/util/time";

interface IShippingAddress {
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
}

interface IPayContext {
  price?: number,
  setPrice?: (price: number) => void,

  paymentLink?: string,
  setPaymentLink?: (paymentLink: string) => void,

  paymentLinkSlug?: string,
  setPaymentLinkSlug?: (paymentLinkSlug: string) => void,

  product?: string,
  setProduct?: (product: string) => void,

  txId?: string,

  email?: string,
  setEmail?: (email: string) => void,
  phone?: string,
  setPhone?: (phone: string) => void,
  shippingAddress?: IShippingAddress,
  setShippingAddress?: (shippingAddress: IShippingAddress) => void,

  setTxIdAndCreatePayment?: (txId: string) => void,

  payProgress?: number;
  setPayProgress?: (progress: number) => void;

  paymentId?: string;
}

const PayContext = createContext<IPayContext>({});

export const PayContextProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [price, setPrice] = useState<number>(0);
  const [paymentLink, setPaymentLink] = useState<string>(null);
  const [paymentLinkSlug, setPaymentLinkSlug] = useState<string>(null);
  const [product, setProduct] = useState<string>(null);
  const [txId, setTxId] = useState<string>('');
  // customer details
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress>(null);
  const [paymentId, setPaymentId] = useState<string>('');

  const [payProgress, setPayProgress] = useState<number>(0);

  const {publicKey} = useWallet();

  const setTxIdAndCreatePayment = async (txId: string) => {
    setTxId(txId);

    const args = {
      paymentLink,
      created: getCurrentTime(),
      amount: price,
      currency: Payment.Currency.SOL,
      walletAddress: publicKey?.toString(),
      txId: txId,
      state: Payment.PaymentState.Acquired,
      paymentDetails: {
        email,
        phone,
        shippingAddress,
      }
    } as Payment.CreatePaymentParams;

    console.log("[pay-context] creating payment with args", JSON.stringify(args));

    const paymentId = await Payment.createPayment(args);
    setPaymentId(paymentId);
  };

  return (
    <PayContext.Provider
      value={{
        price,
        paymentLink,
        paymentLinkSlug,
        setPrice,
        setPaymentLink,
        setPaymentLinkSlug,
        product,
        setProduct,
        txId,
        setTxIdAndCreatePayment,
        // customer details
        email,
        setEmail,
        phone,
        setPhone,
        shippingAddress,
        setShippingAddress,
        payProgress,
        setPayProgress,
        paymentId,
      }}
    >
      {children}
    </PayContext.Provider>
  );
};

export function usePayContext() {
  return useContext(PayContext);
}
