import { Container, Heading, VStack, Wrap} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import renderWithMerchantLayout from "../components/MerchantLayout";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { useAuthContext } from "../context/AuthContext";
import { getPaymentLinks } from "../state/paymentLink";
import { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const {merchantId} = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const loadPaymentLinks = async () => {
      const data = await getPaymentLinks({merchant: merchantId});
      setPaymentLinks(data);
    };

    if (!merchantId) {
      return;
    }

    loadPaymentLinks();
  }, [merchantId]);

  return (
    <>
      <Head>
        <title>Solfront</title>
        <meta
          name="description"
          content="Solfront enables your business to effortlessly create payment
          links, accept cryptocurrency for USD, and incentivize your customers
          to come back."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <VStack spacing={16}>
        <Heading as='h3' size='lg'
          bgGradient={'linear(to-l, #7928CA, #FF0080)'}
          bgClip={'text'}
        >
          Your payment links
        </Heading>
        <Wrap spacing={24} shouldWrapChildren={true} justify={'center'}>
          {
            paymentLinks.map((snapshot) => {
              const paymentLinkId = snapshot.id;
              const paymentLinkData = snapshot.data();
              return (
                <PaymentLinkCard
                  key={paymentLinkId}
                  link={paymentLinkData.link}
                  productName={paymentLinkData.productName}
                  price={paymentLinkData.productPrice}
                  currency={paymentLinkData.productCurrency}
                  onClick={(event) => {
                    router.push(`/pymtlink/${paymentLinkId}`);
                  }}
                />
              );
            })
          }
        </Wrap>
      </VStack>
    </>
  );
}

Dashboard.getLayout = renderWithMerchantLayout;

export default Dashboard;
