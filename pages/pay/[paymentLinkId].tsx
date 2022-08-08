import { Box, Button, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentLinkCard from "../../components/PaymentLinkCard";
import { usePayContext } from "../../context/PayContext";
import { getPaymentLink } from "../../state/paymentLink";

const Pay: NextPage = () => {
  const router = useRouter();
  const { paymentLinkId } = router.query;

  // state that renders
  const [data, setData] = useState({});
  const {price, setPrice, setPaymentLink, setProduct} = usePayContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  // Read the payment link details
  const loadPaymentLink = async (linkId) => {
    const data = await getPaymentLink({linkId: linkId});
    setData(data);

    setIsLoading(false);
    console.log(`loaded ${linkId}:`, JSON.stringify(data));

    // set data for the context provider
    setPrice(data.productPrice);
    setPaymentLink(linkId);
    setProduct(data.productName);
  }
  useEffect(() => {
    if (!paymentLinkId) {
      return;
    }
    setIsLoading(true);
    loadPaymentLink(paymentLinkId);
  }, [paymentLinkId]);

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
          isLoading ?
           <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
            <Spinner/>
           </Box> :
           <PaymentLinkCard
             link={data.link}
             productName={data.productName}
             price={price.toString()}
             currency={data.productCurrency}

             offset={true}
           />
        }

        <Button
          marginTop={'48px!'}
          size={'lg'}
          colorScheme={'green'}
          width={'25%'}

          disabled={publicKey === null}
          onClick={() => {
            // router.push(`${router.route}/checkout`);
            router.push(`/checkout`);
          }}
        >
          🛍 Checkout
        </Button>
      </VStack>
    </>
  )
}

export default Pay;
