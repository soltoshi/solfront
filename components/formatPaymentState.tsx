import { Box } from "@chakra-ui/react"
import { PaymentState } from "../state/payment";

const formatPaymentState = (state) => {

  let bgColor = "gray.100"
  let stateString = "Acquired"

  if (state == PaymentState.Processing) {
    bgColor = "cyan.100";
    stateString = "Processing"
  } else if (state == PaymentState.Fulfilled) {
    bgColor = "green.100";
    stateString = "Fulfilled"
  }
  return (
    <>
      <Box bgColor={bgColor} borderRadius={4} display={'inline-block'} marginLeft={2} padding={2} fontFamily={'mono'}>
        {stateString}
      </Box>
    </>
  )
}

export default formatPaymentState;