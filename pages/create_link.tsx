import Head from "next/head";

import {
   Button,
   FormControl,
   FormHelperText,
   FormLabel,
   Heading,
   Input,
   NumberDecrementStepper,
   NumberIncrementStepper,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   Select,
   VStack
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { createPaymentLink } from "../state/paymentLink";
import { TODO_MERCHANT } from "../state/constants";

const DEFAULT_PRICE_VALUE = 10.00

const CreateLink: NextPage = () => {
  const formik = useFormik({
    initialValues: {
      product: '',
      priceCurrency: '',
      price: DEFAULT_PRICE_VALUE,
    },
    onSubmit: (values) => {
      // TODO: handle form validation
      createPaymentLink({
        merchant: TODO_MERCHANT,
        productCurrency: values.priceCurrency,
        productName: values.product,
        productPrice: values.price,
      });

      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <Head>
        <title>Create Solfront payment link</title>
        <meta name="description" content="Create a payment link to accept SOL with Solfront" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <VStack>
          <Heading as='h3' size='lg' marginBottom='32px'>
            Create a payment link
          </Heading>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing='16px' align='left'>
              <FormControl>
                <FormLabel>Product</FormLabel>
                <Input
                  type='text'
                  id='product'
                  name='product'
                  onChange={formik.handleChange}
                  value={formik.values.product}
                />
                <FormHelperText>Your product's name</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Price currency</FormLabel>
                <Select
                  placeholder='Select price currency'
                  id='priceCurrency'
                  name="priceCurrency"
                  onChange={formik.handleChange}
                  value={formik.values.priceCurrency}
                >
                  <option value='USD'>USD</option>
                  <option value='SOL'>SOL</option>
                </Select>
                {/* TODO: maybe on the merchant side this should just be USD,and
                the customer can render SOL/USD */}
                <FormHelperText>Currency to denominate in</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Price</FormLabel>
                <NumberInput step={5} precision={2} defaultValue={DEFAULT_PRICE_VALUE} min={1.00} max={100.00}>
                  <NumberInputField
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>

            <Button
              // TODO: figure out why this margin gets overridden
              marginTop={50}
              type="submit"
            >
              Create payment link
            </Button>
          </form>
        </VStack>
      </main>
    </div>
  );
}

export default CreateLink;
