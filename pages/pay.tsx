import { Box, Button, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { getPaymentLink } from "../state/paymentLink";

// TODO: remove stub
const LINK_ID = 'pymtlink_AzIdRSYc2C0IX2rPBVWG';

const Pay: NextPage = () => {
  const router = useRouter();

  // state that renders
  const [data, setData] = useState({});

  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  // Read the payment link details
  const loadPaymentLink = async (linkId) => {
    const data = await getPaymentLink({linkId: linkId});
    setData(data);
    console.log(JSON.stringify(data));
  }
  useEffect(() => {
    loadPaymentLink(LINK_ID);
  }, []);

  const apiParams = {};

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          💸 Pay
        </Heading>

        <Box marginTop={'48px!'}>
          <WalletMultiButton />
        </Box>

        {
          !data.link ?
           <></> :
           <PaymentLinkCard
             link={data.link}
             productName={data.productName}
             price={data.productPrice}
             currency={data.productCurrency}

             offset={true}
           />
        }

        <Button
          marginTop={'48px!'}
          size={'lg'}
          colorScheme={'green'}

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
