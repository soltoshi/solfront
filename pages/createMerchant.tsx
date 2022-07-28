import Head from "next/head";

import {
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

const CreateMerchant: NextPage = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    onSubmit: (values) => {
      // TODO: handle form validation
      createMerchant({
        name: values.name,
        email: values.email,
      });

      alert(JSON.stringify(values, null, 2));
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
        <VStack>
          <Heading as='h3' size='lg' marginBottom='32px'>
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
                />
                <FormHelperText>Your business email address</FormHelperText>
              </FormControl>
            </VStack>

            <Button
              // TODO: figure out why this margin gets overridden
              marginTop={50}
              type="submit"
            >
              Create account
            </Button>
          </form>
        </VStack>
      </main>
    </div>
  );
}

export default CreateMerchant;