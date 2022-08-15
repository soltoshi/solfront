import * as dotenv from "dotenv";
const configOutput = dotenv.config({path: "/Users/struong/soltoshi/solfront/.env.local", debug: true});
import { getPayments } from "../state/payment";
import { getPaymentLinks, loadPaymentLink } from "../state/paymentLink";
import firebaseConfig from "../state/firebaseConfig";

async function main() {
  // const configOutput = dotenv.config({path: "/Users/struong/soltoshi/solfront/.env.local", debug: true});
  console.log("> config output", JSON.stringify(configOutput));
  console.log("> firebase config", JSON.stringify(firebaseConfig));


  const merchant = "acct_2Me8tNf3M09V2Nq7LEZX";
  const paymentLink = "pymtlink_BLBkA1BBW8WIADCWecao";

  const response = await getPaymentLinks({merchant});

  console.log("> get payment links response", JSON.stringify(response, null, 2));


}

main()