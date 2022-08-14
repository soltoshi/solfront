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

  await CircleApi.getTransfer("db3df4d5-2aff-4d28-b892-cb06c26fb787");
}

main()
