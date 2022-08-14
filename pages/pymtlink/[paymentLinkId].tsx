import { Box, Heading, HStack, Spinner, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import renderWithMerchantLayout from "../../components/MerchantLayout";
import PaymentLinkCard from "../../components/PaymentLinkCard";
import PaymentsTable from "../../components/PaymentsTable";
import { useAuthContext } from "../../context/AuthContext";
import { getPayments } from "../../state/payment";
import { loadPaymentLink } from "../../state/paymentLink";
import { NextPageWithLayout } from "../_app";

interface PaymentLinkData {
  link?: string;
  productName?: string;
  productCurrency?: string;
  productPrice?: number;
}

const PaymentLinkView: NextPageWithLayout = () => {
  const router = useRouter();
  const { paymentLinkId } = router.query;

  // state that renders
  const [paymentLinkData, setPaymentLinkData] = useState<PaymentLinkData>({});
  const [paymentsData, setPaymentsData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {merchantId} = useAuthContext();

  // Read the payment link details
  useEffect(() => {
    const getPaymentLinkData = async (paymentLinkId) => {
      let loadPaymentLinkResponse = await loadPaymentLink({linkId: paymentLinkId as string});
      if (!loadPaymentLinkResponse) {
        console.error('[pay] no record of payment link with id', paymentLinkId);
        router.push('/404');
      }
      const data = loadPaymentLinkResponse as PaymentLinkData;
      setPaymentLinkData(data);

      let loadPaymentsResponse = await getPayments({merchant: merchantId, paymentLink: paymentLinkId});
      setPaymentsData(loadPaymentsResponse);

      setIsLoading(false);
      console.log('[pay] payment link data', JSON.stringify(data, null, 2));
      console.log('[pay] payments data', JSON.stringify(loadPaymentsResponse, null, 2));
    };

    if (!paymentLinkId || !merchantId) {
      return;
    }

    setIsLoading(true);
    getPaymentLinkData(paymentLinkId);
  }, [paymentLinkId, merchantId]);

  return (
    <>
      <VStack spacing={24}>
        <Heading fontSize={'2xl'}>
          ℹ️ Payment Link Details
        </Heading>

        {
          isLoading ?
           <Box width="100%" display="flex" justifyContent="center" marginTop={'48px!'}>
            <Spinner/>
           </Box> :
           <HStack spacing={24}>
             <PaymentLinkCard
               link={paymentLinkData.link}
               productName={paymentLinkData.productName}
               price={paymentLinkData.productPrice.toString()}
               currency={paymentLinkData.productCurrency}

               offset={true}
             />
             <VStack spacing={12} alignSelf={'flex-start'}>
              <Heading size={'lg'} alignSelf={'flex-start'}>
                Payments processed
              </Heading>
              <PaymentsTable data={paymentsData}/>
             </VStack>

           </HStack>
        }

      </VStack>
    </>
  )
}

PaymentLinkView.getLayout = renderWithMerchantLayout;

export default PaymentLinkView;
