import { Box, Heading, Link, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { usePayContext } from "../context/PayContext";

const Confirmed: NextPage = () => {
  const {paymentLink} = usePayContext();

  return (
    <>
      <VStack>
        <Heading fontSize={'2xl'}>
          ✅ Confirmed
        </Heading>

        <Box
          marginTop={'48px!'}
          textDecoration={'underline'}
        >
          <Link
            href={`/pay/${paymentLink}`}
          >
            🔙 Go back to pay page
          </Link>
        </Box>
      </VStack>
    </>
  )
}

export default Confirmed;
