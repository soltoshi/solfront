import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";

const Pay: NextPage = () => {

  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          THIS IS THE PAYMENT PAGE
        </Heading>

        <Box marginTop={'48px'}>
          <WalletMultiButton />
        </Box>

        <Button
          disabled={publicKey === null}
        >
          Pay
        </Button>
      </VStack>
    </>
  )
}

export default Pay;
