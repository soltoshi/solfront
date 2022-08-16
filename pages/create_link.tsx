import Head from "next/head";

import {
  Box,
   Button,
   Checkbox,
   CheckboxGroup,
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
   Stack,
   VStack
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { createPaymentLink } from "../state/paymentLink";
import { NextPageWithLayout } from "./_app";
import renderWithMerchantLayout from "../components/MerchantLayout";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

const DEFAULT_PRICE_VALUE = 10.00

const CreateLink: NextPageWithLayout = () => {
  const {merchantId} = useAuthContext();
  const [collectDetails, setCollectDetails] = useState({
    email: false,
    phone: false,
    shippingAddress: false,
  });

  const formik = useFormik({
    initialValues: {
      product: '',
      priceCurrency: '',
      price: DEFAULT_PRICE_VALUE,
    },
    onSubmit: (values) => {
      // TODO: handle form validation
      createPaymentLink({
        merchant: merchantId,
        productCurrency: values.priceCurrency,
        productName: values.product,
        productPrice: values.price,
        // we get this state from a different hook
        collectDetails: collectDetails,
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
            bgGradient={'linear(to-l, teal.400, teal.500)'}
            bgClip={'text'}
          >
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
                  bgColor={'white'}
                  boxShadow={'base'}
                  border={'hidden'}
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
                  bgColor={'white'}
                  boxShadow={'base'}
                  border={'hidden'}
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
                    bgColor={'white'}
                    boxShadow={'base'}
                    border={'hidden'}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper  />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Price to charge</FormHelperText>
              </FormControl>
            </VStack>

            <FormControl marginTop={'16px'}>
              <FormLabel>Collect details</FormLabel>
              <CheckboxGroup colorScheme='gray' defaultValue={[]}>
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                  <Checkbox onChange={() => {
                    setCollectDetails({...collectDetails, ...{email: !collectDetails.email}});
                    console.log(collectDetails);

                  }}>Email</Checkbox>
                  <Checkbox onChange={() => {
                    setCollectDetails({...collectDetails, ...{phone: !collectDetails.phone}});
                    console.log(collectDetails);
                  }}>Phone number</Checkbox>
                  <Checkbox onChange={() => {
                    setCollectDetails({...collectDetails, ...{shippingAddress: !collectDetails.shippingAddress}});
                    console.log(collectDetails);
                  }}>Shipping address</Checkbox>
                </Stack>
              </CheckboxGroup>
              <FormHelperText>Information to collect from your customer</FormHelperText>
            </FormControl>

            <Button
              marginTop={50}
              type="submit"
              width={'100%'}
              _hover={{
                bgGradient: 'linear(to-l, teal.400, teal.500)',
                textColor: 'white',
                bgClip: 'border-box'
              }}
              bgGradient={'linear(to-l, teal.500, teal.400)'}
              textColor={'white'}
            >
              Create payment link
            </Button>
          </form>
        </VStack>
      </Box>
    </div>
  );
}

CreateLink.getLayout = renderWithMerchantLayout;

export default CreateLink;
