import { Box, Container, Heading} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import LandingNav from "../components/LandingNav";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solfront</title> <meta name="description" content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingNav/>
      <Box padding={'2rem 2rem'}>
        <Container centerContent={true}>
          <Heading>Landing page</Heading>
        </Container>
      </Box>
    </>
  );
}

export default Home;
