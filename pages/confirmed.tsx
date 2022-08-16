import { Box, Heading, Link, VStack, Text, Alert, AlertIcon, Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, useEffect } from "react";
import PayLayout from "../components/PayLayout";
import NextLink from "next/link";
import PaymentLinkCard from "../components/PaymentLinkCard";
import { usePayContext } from "../context/PayContext";
import { NextPageWithLayout } from "./_app";

const Confirmed: NextPageWithLayout = () => {
  const {paymentLinkSlug, setPayProgress, txId, paymentId, paymentLink, product, price} = usePayContext();

  useEffect(() => {
    setPayProgress(100)
  }, [setPayProgress]);

  return (
    <>
      <VStack>

        <VStack
          // padding={24}
          spacing={8}
          // bgColor={'whiteAlpha.300'}
          rounded={'lg'}
          // boxShadow={'lg'}
        >
          <Heading size={'md'}
            // bgGradient={'linear(to-l, #7928CA, #FF0080)'}
            // bgClip={'text'}
          >
            Your purchase has been confirmed!
          </Heading>
          <PaymentLinkCard
            link={""}
            productName={product}
            price={price.toString()}
            currency={"USD"}
            offset={false}
          />

          <Alert status={'info'} fontSize={'xs'} bgColor={'gray.100'} width={'auto'} rounded={'md'}>
            <AlertIcon/>
            <VStack spacing={2}>
              <Text fontWeight={'bold'}>Purchase details</Text>
              <Link
                marginLeft={1}
                bgGradient={'linear(to-l, #7928CA, #FF0080)'}
                bgClip={'text'}
                fontWeight={'bold'}
                href={`https://solscan.io/tx/${txId}?cluster=devnet`}
                _hover={{
                  bgGradient: 'linear(to-l, #FF0080, #7928CA)',
                  bgClip: 'text',
                }}
              >
                View your transaction on Solscan
              </Link>
              <Text fontFamily={'mono'} background={'gray.50'} rounded={'lg'} padding={2}>
                {paymentId}
              </Text>
            </VStack>
          </Alert>

          <NextLink href={`/pay/${paymentLinkSlug}`} passHref>
            <Button
              as="a"
              variant={'solid'}
              colorScheme={'gray'}
              size={'md'}
              mr={4}
            >
              Go back to pay page
            </Button>
          </NextLink>

        </VStack>
      </VStack>
    </>
  )
}

Confirmed.getLayout = function getLayout(page: ReactElement) {
  return (
    <PayLayout>
      {page}
    </PayLayout>
  );
}

export default Confirmed;
