import { Container, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { getPaymentLinks } from "../state/paymentLink";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [paymentLinks, setPaymentLinks] = useState([]);

  const loadPaymentLinks = async () => {
    const data = await getPaymentLinks();
    setPaymentLinks(data);
  };

  useEffect(() => {
    loadPaymentLinks();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Solfront</title> <meta name="description" content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>
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
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export default Home;
