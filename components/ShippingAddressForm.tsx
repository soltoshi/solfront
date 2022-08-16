import { VStack, FormControl, FormLabel, Input, FormHelperText, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, CheckboxGroup, Stack, Checkbox, Button, Heading, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";

export default function ShippingAddressForm(props) {
  const formik = useFormik({
    initialValues: {
      streetAddress: '',
      city: '',
      country: '',
      postalCode: '',
    },
    onSubmit: (values) => {
      console.log("not submitting since this is handled");

    },
  });

  return (
    <VStack spacing={8}>
      <Heading alignSelf={'flex-start'} size={'md'}>
        Shipping address
      </Heading>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        onChange={() => {
          props.onChange(formik.values);
        }}
      >
        <VStack spacing='16px' align='left'>
          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input
              type='text'
              placeholder='e.g. 123 Main St.'
              id='streetAddress'
              name='streetAddress'
              onChange={formik.handleChange}
              value={formik.values.streetAddress}
              bgColor={'white'}
              boxShadow={'sm'}
              border={'hidden'}
            />
          </FormControl>

          <FormControl>
            <FormLabel>City</FormLabel>
            <Input
              type='text'
              placeholder='e.g. Los Angeles'
              id='city'
              name='city'
              onChange={formik.handleChange}
              value={formik.values.city}
              bgColor={'white'}
              boxShadow={'sm'}
              border={'hidden'}
            />
          </FormControl>

          <HStack spacing={4}>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                type='text'
                placeholder='e.g. United States'
                id='country'
                name='country'
                onChange={formik.handleChange}
                value={formik.values.country}
                bgColor={'white'}
                boxShadow={'sm'}
                border={'hidden'}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Postal code</FormLabel>
              <Input
                type='text'
                placeholder='e.g. 12345'
                id='postalCode'
                name='postalCode'
                onChange={formik.handleChange}
                value={formik.values.postalCode}
                bgColor={'white'}
                boxShadow={'sm'}
                border={'hidden'}
              />
            </FormControl>
          </HStack>

        </VStack>
      </form>
    </VStack>
  );
}
