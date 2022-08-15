import { Container, Heading, Wrap} from "@chakra-ui/react";
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

      <Container maxW='' centerContent={true}>
        <Heading as='h3' size='lg' marginBottom='32px'>
          Your payment links
        </Heading>
        <Wrap spacing={24} shouldWrapChildren={true} align='center'>
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
      </Container>
    </>
  );
}

Dashboard.getLayout = renderWithMerchantLayout;

export default Dashboard;
