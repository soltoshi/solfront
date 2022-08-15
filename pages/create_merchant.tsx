import Head from "next/head";

import {
  Alert,
  AlertIcon,
  Box,
   Button,
   FormControl,
   FormHelperText,
   FormLabel,
   Heading,
   Input,
   VStack
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { createMerchant } from "../state/merchant";
import { useAuthContext } from "../context/AuthContext";
import { NextPageWithLayout } from "./_app";
import renderWithMerchantLayout from "../components/MerchantLayout";
import { useRouter } from "next/router";

const CreateMerchant: NextPageWithLayout = () => {
  const {authUid, setMerchantId} = useAuthContext();

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      bankAccountNumber: '',
    },
    onSubmit: async (values) => {
      // TODO: handle form validation
      const merchantId = await createMerchant({
        name: values.name,
        email: values.email,
        bankAccountNumber: values.bankAccountNumber,
        authUid: authUid,
      });
      setMerchantId(merchantId);

      router.push('/dashboard');
    },
  });

  return (
    <div>
      <Head>
        <title>Create your Solfront Account</title>
        <meta name="description" content="Creates your Solfront merchant account." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box
          bgColor={'whiteAlpha.900'}
          boxShadow={'lg'}
          padding={'4rem 2rem'}
          width={'50vh'}
          rounded={'xl'}
          marginTop={8}
        >
          <VStack>
            <Heading as='h3' size='lg' marginBottom='32px'
              bgGradient={'linear(to-l, #7928CA, #FF0080)'}
              bgClip={'text'}
            >
              Create your Solfront account
            </Heading>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing='16px' align='left'>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type='text'
                    id='name'
                    name='name'
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    bgColor={'white'}
                    boxShadow={'base'}
                    border={'hidden'}
                  />
                  <FormHelperText>Your Solfront merchant name</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    bgColor={'white'}
                    boxShadow={'base'}
                    border={'hidden'}
                  />
                  <FormHelperText>Your business email address</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Bank account number</FormLabel>
                  <Input
                    type='text'
                    id='bank_account_number'
                    name='bankAccountNumber'
                    onChange={formik.handleChange}
                    value={formik.values.bankAccountNumber}
                    bgColor={'white'}
                    boxShadow={'base'}
                    border={'hidden'}
                  />
                  <FormHelperText>Bank account to send USD to</FormHelperText>
                  <Alert status={'warning'} fontSize={'xs'} marginTop={8} bgColor={'white'}>
                    <AlertIcon />
                    Please use a random bank account number since we are on Devnet and do not move real money yet!
                  </Alert>
                </FormControl>
              </VStack>

              <Button
                marginTop={50}
                type="submit"
                width={'100%'}
                _hover={{
                  bgGradient: 'linear(to-l, #7928CA, #FF0080)',
                  textColor: 'white',
                  bgClip: 'border-box'
                }}
                bgGradient={'linear(to-l, #FF0080, #7928CA)'}
                textColor={'white'}
              >
                Create account
              </Button>
            </form>
          </VStack>
        </Box>
      </main>
    </div>
  );
}

CreateMerchant.getLayout = renderWithMerchantLayout;

export default CreateMerchant;
