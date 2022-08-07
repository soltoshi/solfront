import { Box, Heading, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, Transaction } from "@solana/web3.js";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { MakeTransactionInputData, MakeTransactionOutputData } from "./api/make_transaction";
import { findReference, FindReferenceError } from "@solana/pay";
import { usePayContext } from "../context/PayContext";

const MERCHANT_SOL_WALLET = 't4NDTNUX9n4MYe42i62cBRzNNJw9GZLDdBdv5z1w972';

const Checkout: NextPage = () => {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const {price, paymentLink, product} = usePayContext();

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // TODO: tried to use Solana Pay transfer request scheme[0] here but linking
  // to it results in an error since there's no handler for the protocol in the
  // browser. The behavior I expected was that Phantom would just open.
  // [0] https://docs.solanapay.com/core/transfer-request/merchant-integration
  //
  // const transferRequestFields: TransferRequestURLFields = {
  //   recipient: new PublicKey(MERCHANT_SOL_WALLET),
  //   amount: new BigNumber(0.001),
  //   reference: reference,
  //   label: 'Solfront store',
  //   message: `Solfront - your order - ${product}`,
  //   memo: paymentLink.toString(),
  // };
  // const solanaPayUrl = encodeURL(transferRequestFields);
  // console.log('[checkout] solana pay url created: ', solanaPayUrl.toString());

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

    // Deserialize the transaction from the response
    const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'));
    setTransaction(transaction);
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
