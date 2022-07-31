import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, Transaction } from "@solana/web3.js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const Confirmed: NextPage = () => {
  const router = useRouter();
  const {connection} = useConnection();
  const {publicKey, sendTransaction} = useWallet();

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Read the payment link details
  const apiParams = {};

  // Generate unique reference that'll be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          ✅ Confirmed
        </Heading>
      </VStack>
    </>
  )
}

export default Confirmed;
