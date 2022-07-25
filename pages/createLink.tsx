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

const CreateLink: NextPage = () => {
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
          <VStack spacing='16px' align='left'>
            <FormControl>
              <FormLabel>Product</FormLabel>
              <Input type='text'/>
              <FormHelperText>Your product's name</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Price currency</FormLabel>
              <Select placeholder='Select price currency'>
                <option value='USD'>USD</option>
                <option value='SOL'>SOL</option>
              </Select>
              {/* TODO: maybe on the merchant side this should just be USD,and
              the customer can render SOL/USD */}
              <FormHelperText>Currency to denominate in</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Price</FormLabel>
              <NumberInput step={5} precision={2} defaultValue={10.00} min={1.00} max={100.00}>
                <NumberInputField />
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
          >
            Create payment link
          </Button>
        </VStack>

      </main>
    </div>
  );
}

export default CreateLink;
