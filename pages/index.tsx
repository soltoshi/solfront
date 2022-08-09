import { Box, Button, Checkbox, Container, Flex, FormControl, FormLabel, Heading, Input, Link, Stack, useColorModeValue, Wrap} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { getPaymentLinks } from "../state/paymentLink";

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
    <>
      <Head>
        <title>Solfront</title> <meta name="description" content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW='' centerContent={true}>
        <Heading as='h3' size='lg'>
          Login
        </Heading>

        <Flex
          // minH={'100vh'}
          align={'center'}
          justify={'center'}
          // bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}>
              <Stack spacing={8}>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input type="email"/>
                </FormControl>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Get magic link 🪄
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Container>
    </>
  );
}

export default Home;
