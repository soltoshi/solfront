import { Box, Heading, VStack, Spinner} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, Transaction } from "@solana/web3.js";
import { NextPage } from "next";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MakeTransactionInputData, MakeTransactionOutputData } from "./api/make_transaction";
import { findReference, FindReferenceError, encodeURL, TransferRequestURLFields, createQR } from "@solana/pay";
import { usePayContext } from "../context/PayContext";
import { shopAddress } from "../lib/addresses";

// TODO: affordance for rendering shipping address
const Checkout: NextPage = () => {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solPrice, setSolPrice] = useState<number>(null);

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const {price, paymentLink, product, setTxIdAndCreatePayment} = usePayContext();

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // ref to a div where we'll show the QR code
  const qrRef = useRef<HTMLDivElement>(null)

  // Show the QR code
  useEffect(() => {
    if (!solPrice) {
      return;
    }

    const bnSolPrice = new BigNumber(solPrice);

    // We allow users the option to cancel the wallet transaction and pay using
    // the QR code instead with a mobile wallet.
    // Solana Pay transfer params
    //
    // TODO: tried to use Solana Pay transfer request scheme[0] in a button but
    // linking to it results in an error since there's no handler for the protocol
    // in the browser. The behavior I expected was that Phantom would just open.
    // [0] https://docs.solanapay.com/core/transfer-request/merchant-integration
    const urlParams: TransferRequestURLFields = {
      recipient: shopAddress,
      amount: bnSolPrice,
      reference,
      label: "Solfront merchant",
      message: `Solfront order - ${product}`,
      memo: paymentLink.toString(),
    }

    // Encode the params into the format shown
    const url = encodeURL(urlParams)
    console.log('[checkout] generating URL for Solana Pay QR code', { url })

    const qr = createQR(url, 384, 'transparent')
    if (qrRef.current && bnSolPrice.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  }, [solPrice])

  // Use our API to fetch the transaction for the selected items
  async function getTransaction() {
    if (!publicKey) {
      return;
    }

    const body: MakeTransactionInputData = {
      account: publicKey.toString(),
      reference: reference.toString(),
      price: price,
      paymentLink: paymentLink,
    }

    console.log('[checkout] sending /make_transaction request w/body', JSON.stringify(body));

    const response = await fetch(`/api/make_transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })

    const json = await response.json() as MakeTransactionOutputData

    if (response.status !== 200) {
      console.error(json);
      return;
    }

    // Set the SOLUSD price
    setSolPrice(json.solPrice);

    // Deserialize the transaction from the response
    const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'));
    setTransaction(transaction);
    setIsLoading(true);
    console.log(transaction);
  }

  useEffect(() => {
    getTransaction()
  }, [publicKey])

  // // Send the fetched transaction to the connected wallet
  async function trySendTransaction() {
    if (!transaction) {
      return;
    }
    try {
      console.log('[checkout] sending tx to wallet', JSON.stringify(transaction));
      await sendTransaction(transaction, connection)
    } catch (e) {
      console.error(e)
    }
  }

  // Send the transaction once it's fetched
  useEffect(() => {
    trySendTransaction()
  }, [transaction])

  // Check every 0.5s if the transaction is completed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference, {finality: 'confirmed'})

        // Use the pay context to record the tx id and track
        setTxIdAndCreatePayment(signatureInfo.signature);

        setIsLoading(false);
        router.push('/confirmed')
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return;
        }
        console.error('Unknown error', e)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!publicKey) {
    return (
      <div className='flex flex-col gap-8 items-center'>
        <div><Link href='/buy'>Cancel</Link></div>

        <WalletMultiButton />

        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          🛍 Checkout
        </Heading>

        {/* We render the QR code for the customer to scan */}
        <Box ref={qrRef}/>

        {
          isLoading ?
           <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
            <Spinner/>
           </Box> :
           <></>
        }

        <Box
          marginTop={'48px!'}
          textDecoration={'underline'}
        >
          <Link
            href={'/confirmed'}
          >
            ➡️ Go to confirmation page
          </Link>
        </Box>

        {/* <CLink href={solanaPayUrl.toString()}>
          <Button>Solana Pay</Button>
        </CLink> */}
      </VStack>
    </>
  )
}

export default Checkout;
