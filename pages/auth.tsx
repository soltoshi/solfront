import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import renderWithMerchantLayout from "../components/MerchantLayout";
import { sendSignInLinkToMerchantEmail } from "../state/auth";
import { NextPageWithLayout } from "./_app";

const Auth: NextPageWithLayout = () => {
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
              boxShadow={'base'}
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
                  {/* <Heading size={'md'}>Get magic link</Heading> */}
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                      // bgColor={"whiteAlpha.100"}
                      placeholder={'Your email'}
                      type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
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
          </Stack>
        </Flex>
      </Container>
    </>
  );
}

Auth.getLayout = renderWithMerchantLayout;

export default Auth;
