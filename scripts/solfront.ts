import * as dotenv from "dotenv";
const configOutput = dotenv.config({path: "/Users/struong/soltoshi/solfront/.env.local", debug: true});
import { getPayments } from "../state/payment";
import { loadPaymentLink } from "../state/paymentLink";
import firebaseConfig from "../state/firebaseConfig";

async function main() {
  // const configOutput = dotenv.config({path: "/Users/struong/soltoshi/solfront/.env.local", debug: true});
  console.log("> config output", JSON.stringify(configOutput));
  console.log("> firebase config", JSON.stringify(firebaseConfig));


  const merchant = "acct_60ETGmuWTAKcE4aywOhx";
  const paymentLink = "pymtlink_BLBkA1BBW8WIADCWecao";

  // load payment link data
  let response = await loadPaymentLink({linkId: paymentLink});
  console.log("> payment link data", JSON.stringify(response, null, 2));

  // load all payments affiliated with payment link
  response = await getPayments({merchant, paymentLink});
  console.log("> payments data for payment link", JSON.stringify(response, null, 2));
}

main()