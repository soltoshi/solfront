import * as dotenv from "dotenv";
const configOutput = dotenv.config({path: "/Users/struong/soltoshi/solfront/.env.local", debug: true});

import CircleApi from "../state/circle_api";

async function main() {
  // const bankAccountResponse = await createBankAccount();

  // await sendPayout({bankAccountId: bankAccountResponse.data.id});

  // await listPayouts();
  // await listBalances();

  // await transferOut({
  //   destinationAddress: "EHaz4Hvce6JzV1nfdSETd7jbxtL2c2KxVYPVMiseKeZj",
  //   destinationChain: 'SOL',
  // })

  const response = await CircleApi.getTransfer("db3df4d5-2aff-4d28-b892-cb06c26fb787");
  console.log("get transfer response", JSON.stringify(response, null, 2));

}

main()
