import { Box, Button, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentLinkCard from "../../components/PaymentLinkCard";
import { usePayContext } from "../../context/PayContext";
import { getPaymentLinkBySlug } from "../../state/paymentLink";

interface PaymentLinkData {
  link?: string;
  productName?: string;
  productCurrency?: string;
  productPrice?: number;
}

const Pay: NextPage = () => {
  const router = useRouter();
  const { paymentLinkId } = router.query;

  // state that renders
  const [data, setData] = useState<PaymentLinkData>({});
  const {price, setPrice, setPaymentLink, setProduct} = usePayContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  // Read the payment link details
  const loadPaymentLink = async (slug) => {
    const dataArray = await getPaymentLinkBySlug({slug});
    if (dataArray.length == 0) {
      console.error('[pay] no record of payment link with slug', slug);
      router.push('/404');
    }
    setData(dataArray[0]);

    setIsLoading(false);
    console.log(`[pay] loaded payment link ${slug}:`, JSON.stringify(dataArray[0]));
    const data = dataArray[0] as PaymentLinkData;

    // set data for the context provider
    setPrice(data.productPrice);
    setPaymentLink(paymentLinkId as string);
    setProduct(data.productName);
  };

  useEffect(() => {
    if (!paymentLinkId) {
      return;
    }
    setIsLoading(true);
    loadPaymentLink(paymentLinkId);
  }, [paymentLinkId]);

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
