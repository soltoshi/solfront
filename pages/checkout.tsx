import { Link, Box, Heading, VStack, Spinner, Text, Skeleton, Divider, Image, Button, HStack, Alert, AlertIcon, Center} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, Transaction } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { MakeTransactionInputData, MakeTransactionOutputData } from "./api/make_transaction";
import { findReference, FindReferenceError, encodeURL, TransferRequestURLFields, createQR } from "@solana/pay";
import { usePayContext } from "../context/PayContext";
import { shopAddress } from "../lib/addresses";
import { NextPageWithLayout } from "./_app";
import PayLayout from "../components/PayLayout";
import Pyth from "../state/pyth";

const Checkout: NextPageWithLayout = () => {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solPrice, setSolPrice] = useState<number>(null);

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const {price, paymentLink, product, setTxIdAndCreatePayment, setPayProgress} = usePayContext();

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // ref to a div where we'll show the QR code
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPayProgress(66)
  }, [setPayProgress]);

  useEffect(() => {
    async function calculateAndSetSolPrice() {
      const quote = await Pyth.getSolUsdPrice();
      const solPrice = price / quote;
      setSolPrice(solPrice);
    }
    calculateAndSetSolPrice();
  }, [price])

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
    // note: tried to use Solana Pay transfer request scheme[0] in a button but
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


  // Send the transaction once we've created it
  useEffect(() => {
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

    trySendTransaction();
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

  return (
    <>
      <VStack spacing={12}>
        <Alert status={'info'} fontSize={'xs'} bgColor={'gray.100'} width={'auto'} rounded={'md'}>
          Pay using a browser wallet or mobile wallet via
          <Link
            marginLeft={1}
            bgGradient={'linear(to-l, #1af79e, #9745fd)'}
            bgClip={'text'}
            fontWeight={'bold'}
            href={'https://solanapay.com/'}
            _hover={{
              bgGradient: 'linear(to-l, #9745fd, #1af79e)',
              bgClip: 'text',
            }}
          >
            Solana Pay
          </Link>
        </Alert>

        <VStack spacing={8}>
          <WalletMultiButton
            style={{
              padding: '100px!'
            }}
          />
          {
            isLoading ?
            <Alert status={'info'} fontSize={'xs'} marginTop={8} bgColor={'gray.100'} width={'auto'} rounded={'md'}>
              <AlertIcon/>
              Please confirm the transaction with your connected wallet
              <Spinner boxSize={4} marginLeft={2}/>
            </Alert> :
            <></>
          }
        </VStack>

          <HStack>
            <Divider borderBottomWidth={2} width={'75vh'}/>
          </HStack>

          <VStack spacing={8}>
            <HStack
              bgColor={'black'}
              px={24}
              py={4}
              fontSize={24}
              textColor={'white'}
              boxShadow={'base'}
              rounded={'lg'}
              spacing={2}
            >
              <Text>
                Pay with
              </Text>
              <Image
                width={24}
                height={'auto'}
                src="/solanapay.png"
              />
            </HStack>


            {/* We render the QR code for the customer to scan */}
            {
              !!qrRef ?
                <Box ref={qrRef}/> :
                <Skeleton boxSize={384}/>
            }
          </VStack>


          {/* <Box
            marginTop={'48px!'}
            textDecoration={'underline'}
          >
            <Link
              href={'/confirmed'}
            >
              ➡️ Go to confirmation page
            </Link>
          </Box> */}
      </VStack>
    </>
  )
}

Checkout.getLayout = function getLayout(page: ReactElement) {
  return (
    <PayLayout>
      {page}
    </PayLayout>
  );
}

export default Checkout;
