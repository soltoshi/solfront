import { Box, Heading, Link, VStack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement } from "react";
import PayLayout from "../components/PayLayout";
import { usePayContext } from "../context/PayContext";
import { NextPageWithLayout } from "./_app";

const Confirmed: NextPageWithLayout = () => {
  const {paymentLinkSlug} = usePayContext();

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          ✅ Confirmed
        </Heading>

        <Box
          marginTop={'48px!'}
        >

          <Box fontWeight={'bold'} textColor={'red'} marginBottom={24}>
            <Text>
              TODO: link transaction ID to Solana Devnet Explorer
            </Text>
            <Text>
              TODO: router should have payment ID in it
            </Text>
            <Text>
              TODO: show payment details
            </Text>
          </Box>

          <Link
            href={`/pay/${paymentLinkSlug}`}
            textDecoration={'underline'}
          >
            🔙 Go back to pay page
          </Link>
        </Box>
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
