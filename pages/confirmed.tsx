import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
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

  // Generate unique reference that'll be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          ✅ Confirmed
        </Heading>

        <Box
          marginTop={'48px!'}
          textDecoration={'underline'}
        >
          <Link
            href={'/pay'}
          >
            🔙 Go back to pay page
          </Link>
        </Box>
      </VStack>
    </>
  )
}

export default Confirmed;
