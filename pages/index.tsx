import { Box, Center, Container, Text, Heading, Link, VStack} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
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
      <Box
        padding={'2rem 2rem'}
        bgColor={'gray.50'}
        height={'100vh'}
      >
        <VStack spacing={12}>
          <Heading width={'80vh'} size={'3xl'} textAlign={'center'} display={'inline-block'}>
            The{" "}
            <Text
              as={'span'}
              // bgGradient={'linear(to-l, #7928CA, #FF0080)'}
              bgGradient={'linear(to-l, gray.500, gray.700, gray.600)'}
              bgClip={'text'}
              fontWeight={'bold'}
            >
              no-code commerce platform
            </Text>
            {" "}for
            <Text
              as={'span'}
              bgGradient={'linear(to-l, #03ce8f, #5089c7, #9649fd)'}
              bgClip={'text'}
              fontWeight={'bold'}
            >{" "}Solana</Text>
          </Heading>

          <Text width={'80vh'} fontSize={'2xl'} textAlign={'center'} fontWeight={'normal'}>
            Solfront enables you to accept Solana payments and receive USD without writing a single line of code.
          </Text>
        </VStack>
      </Box>
      <Box boxShadow={'inner'} bgColor={'gray.50'} borderColor={'gray.50'} height={'100%'}>
        <footer className={styles.footer}>
          <Center h={'inherit'}>
            <Link
              href="https://solfront.app/"
              _hover={{'text-decoration': 'none'}}
              fontSize={'xs'}
            >
              Welcome to
              <Text
                bgGradient={'linear(to-l, #7928CA, #FF0080)'}
                bgClip={'text'}
                fontWeight={'bold'}
                fontSize={'sm'}
                marginLeft={1}
              >
                Solfront
              </Text>
            </Link>
          </Center>
        </footer>
      </Box>
    </>
  );
}

export default Home;
