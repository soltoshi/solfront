import { Container, Heading} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Solfront</title> <meta name="description" content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container centerContent={true}>
        <Heading>Landing page</Heading>
      </Container>
    </>
  );
}

export default Home;
