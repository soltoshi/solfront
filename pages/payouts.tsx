import { Text, Center, VStack, Heading, Spinner, TableContainer, Table, Thead, Tr, Th, Td, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import formatPaymentState from "../components/formatPaymentState";
import renderWithMerchantLayout from "../components/MerchantLayout";
import { useAuthContext } from "../context/AuthContext";
import { Currency, getPayments, PaymentState } from "../state/payment";
import { renderEpochSeconds } from "../state/util/time";
import { NextPageWithLayout } from "./_app";


const Payouts: NextPageWithLayout = () => {
  // state that renders
  const [payoutsData, setPayoutsData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPaidOut, setTotalPaidOut] = useState<number>(0.00);
  const [totalProcessing, setTotalProcessing] = useState<number>(0.00);

  const {merchantId} = useAuthContext();

  // Read all payouts
  useEffect(() => {
    const getPayoutsData = async () => {
      // 1. load all payments
      // 2. sort into states
      const payments = await getPayments({merchant: merchantId, paymentLink: null, orderByState: true});

      console.log("number of found payments: ", payments.length);

      // 3. TODO: see if states are up to date
      // for all payments in Processing, we should check how the payout is doing
      // at circle

      // 4. calculate sum
      if (payments.length > 0) {
        const [totalPaidOut, totalProcessing] = payments.map((snapshot) => {
          const data = snapshot.data();
          let [paidOut, processing] = [0, 0];
          if (data.state == PaymentState.Fulfilled) {
            paidOut = data.amount;
          } else if (data.state == PaymentState.Processing) {
            processing = data.amount;
          }
          return [paidOut, processing];
        }).reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]]);
      }

      setTotalPaidOut(totalPaidOut);
      setTotalProcessing(totalProcessing);
      setPayoutsData(payments);

      console.log({
        totalProcessing,
        totalPaidOut
      });


      setIsLoading(false);
    };

    setIsLoading(true);
    if (!merchantId) {
      return;
    }

    getPayoutsData();
  }, [merchantId]);

  return (
    <>
      <Center
        width={'fit-content'}
        bgColor={'white'}
        boxShadow={'base'}
        padding={'2rem 2rem'}
        rounded={'xl'}
        marginTop={8}
      >
        <VStack spacing={8} width={'fit-content'} alignSelf={'center'}>
          <Heading fontSize={'2xl'} alignSelf={'flex-start'}
            bgGradient={'linear(to-l, blue.400, blue.500)'}
            bgClip={'text'}
          >
            Your payouts
          </Heading>

          {
            isLoading ?
            <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
              <Spinner/>
            </Box> :
            <VStack spacing={8}>
              <Box alignSelf={'flex-start'}>
                <Text>
                  Total paid out:
                  <Box bgColor={"green.100"} borderRadius={4} display={'inline-block'} marginLeft={2} padding={1} fontFamily={'mono'}>
                    {totalPaidOut.toFixed(2)}
                  </Box>
                </Text>
                <Text marginTop={2}>
                  Total processing:
                  <Box bgColor={"cyan.100"} borderRadius={4} display={'inline-block'} marginLeft={2} padding={1} fontFamily={'mono'}>
                    {totalProcessing.toFixed(2)}
                  </Box>
                </Text>
              </Box>
              <TableContainer
                boxShadow={'sm'}
                rounded='lg'
              >
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Created</Th>
                      <Th isNumeric>Amount</Th>
                      <Th>Currency</Th>
                      <Th>State</Th>
                      <Th>Circle Payout ID</Th>
                    </Tr>
                  </Thead>

                  {
                    payoutsData.map((snapshot) => {
                      const data = snapshot.data();
                      return (
                        <Tr
                          key={snapshot.id}
                        >
                          <Td>
                            <Box bgColor={"gray.100"} borderRadius={4} display={'inline-block'} marginLeft={2} padding={2} fontFamily={'mono'}>
                                {snapshot.id}
                            </Box>
                          </Td>
                          <Td>{renderEpochSeconds(data.created)}</Td>
                          <Td isNumeric>{data.amount}</Td>
                          <Td>{Currency[data.currency]}</Td>
                          <Td>{formatPaymentState(data.state)}</Td>
                          <Td>
                            <Box bgColor={"gray.100"} borderRadius={4} display={'inline-block'} marginLeft={2} padding={2} fontFamily={'mono'}>
                                {data.circle_payout_id || 'null'}
                            </Box>
                          </Td>
                        </Tr>
                      )
                    })
                  }

                </Table>
              </TableContainer>
            </VStack>
          }

        </VStack>
      </Center>
    </>
  )
}

Payouts.getLayout = renderWithMerchantLayout;

export default Payouts;
