import { Container, Heading, Wrap} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import renderWithMerchantLayout from "../components/MerchantLayout";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { useAuthContext } from "../context/AuthContext";
import { getPaymentLinks } from "../state/paymentLink";
import { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const {merchantId} = useAuthContext();

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
            paymentLinks.map((paymentLinkData) => {
              return (
                <PaymentLinkCard
                  key={paymentLinkData.link}
                  link={paymentLinkData.link}
                  productName={paymentLinkData.productName}
                  price={paymentLinkData.productPrice}
                  currency={paymentLinkData.productCurrency}
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
