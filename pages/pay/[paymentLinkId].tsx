import { Box, Button, FormControl, FormLabel, Heading, Input, Spinner, VStack } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import PayLayout from "../../components/PayLayout";
import PaymentLinkCard from "../../components/PaymentLinkCard";
import ShippingAddressForm from "../../components/ShippingAddressForm";
import { usePayContext } from "../../context/PayContext";
import { getPaymentLinkBySlug } from "../../state/paymentLink";
import { NextPageWithLayout } from "../_app";

interface PaymentLinkData {
  link?: string;
  productName?: string;
  productCurrency?: string;
  productPrice?: number;
  collectDetails?: {
    email: boolean;
    phone: boolean;
    shippingAddress: boolean;
  };
}

const Pay: NextPageWithLayout = () => {
  const router = useRouter();
  const { paymentLinkId: paymentLinkSlug } = router.query;

  // state that renders
  const [data, setData] = useState<PaymentLinkData>({});
  const {price, setPrice, setPaymentLink, setProduct, setPaymentLinkSlug} = usePayContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // state for collection details
  const {email, setEmail, phone, setPhone, setShippingAddress} = usePayContext();


  // public key of a connected wallet, if there is one
  const {publicKey} = useWallet();

  // Read the payment link details
  useEffect(() => {
    const getPaymentLinkData = async (slug) => {
      const dataArray = await getPaymentLinkBySlug({slug});
      if (dataArray.length == 0) {
        console.error('[pay] no record of payment link with slug', slug);
        router.push('/404');
      }
      const paymentLink = dataArray[0];
      const data = paymentLink.data() as PaymentLinkData;

      setData(data);

      setIsLoading(false);
      console.log(`[pay] loaded payment link ${slug}:`, paymentLink.id);
      console.log('[pay] parsed data', JSON.stringify(data));

      // set data for the context provider
      setPrice(data.productPrice);
      setPaymentLink(paymentLink.id as string);
      setProduct(data.productName);
    };

    setPaymentLinkSlug(paymentLinkSlug as string);

    if (!paymentLinkSlug) {
      return;
    }

    setIsLoading(true);
    getPaymentLinkData(paymentLinkSlug);
  }, [paymentLinkSlug]);

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

        {/* Render inputs for collecting customer details START */}
        <VStack spacing={24}>

          {
            data.collectDetails?.email &&
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type={'email'}
                placeholder="Your email"
                id='email'
                name='email'
                onChange={(event) => {
                  event.preventDefault();
                  setEmail(event.target.value);
                }}
                value={email}
              />
            </FormControl>
          }

          {
            data.collectDetails?.phone &&
            <FormControl>
              <FormLabel>Phone number</FormLabel>
              <Input
                type={'text'}
                placeholder="Your phone number"
                id='phone'
                name='phone'
                onChange={(event) => {
                  event.preventDefault();
                  setPhone(event.target.value);
                }}
                value={phone}
              />
            </FormControl>
          }

          {
            data.collectDetails?.shippingAddress &&
            <ShippingAddressForm
              onChange={(values) => {
                console.log('setting shipping address', JSON.stringify(values));
                setShippingAddress(values);
              }}
            />
          }
        </VStack>


        {/* Render inputs for collecting customer details END */}

        <Button
          marginTop={'48px!'}
          size={'lg'}
          colorScheme={'green'}
          width={'25%'}

          disabled={publicKey === null}
          onClick={() => {
            // submit any details to the pay context
            router.push(`/checkout`);
          }}
        >
          🛍 Checkout
        </Button>
      </VStack>
    </>
  )
}

Pay.getLayout = function getLayout(page: ReactElement) {
  return (
    <PayLayout>
      {page}
    </PayLayout>
  );
}

export default Pay;
