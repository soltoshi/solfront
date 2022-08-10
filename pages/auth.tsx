import { Box, Button, Container, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Stack, useColorModeValue} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { createMerchantAuth, sendSignInLinkToMerchantEmail } from "../state/auth";

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

      <Container maxW='' centerContent={true}>
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

              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  sendSignInLinkToMerchantEmail(email).then(() => {
                    setEmailSent(true);
                  });
                }}
              >
                <Stack spacing={8}>
                  <Heading size={'md'}>Get magic link</Heading>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </FormControl>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    type={'submit'}
                    disabled={emailSent}
                  >
                    {
                      emailSent ?
                        `✨ Sent magic link to ${email} ✨` :
                        'Get magic link 🪄'
                    }
                  </Button>
                </Stack>
              </form>

            </Box>

            {/* This is the email + pw login component */}

            {/* <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}>

              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  createMerchantAuth(email, password).then(() => {
                    setEmailSent(true);
                  });
                }}
              >
                <Stack spacing={8}>
                  <Heading size={'md'}>Register</Heading>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </FormControl>
                  <FormControl id="email">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </FormControl>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    type={'submit'}
                    disabled={emailSent}
                  >
                    {
                      emailSent ?
                        `✨ Registered ${email} ✨` :
                        'Register'
                    }
                  </Button>
                </Stack>
              </form>

            </Box> */}
          </Stack>
        </Flex>
      </Container>
    </>
  );
}

export default Home;
