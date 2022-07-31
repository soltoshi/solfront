import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Pay: NextPage = () => {

  const router = useRouter();

  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          💸 Pay
        </Heading>

        <Box marginTop={'48px'}>
          <WalletMultiButton />
        </Box>

        <Button
          disabled={publicKey === null}
          onClick={() => {
            // router.push(`${router.route}/checkout`);
            router.push(`/checkout`);
          }}
        >
          Pay
        </Button>
      </VStack>
    </>
  )
}

export default Pay;
