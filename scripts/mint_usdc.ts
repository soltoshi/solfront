import { TokenMint } from "@bonfida/utils";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";

const ExchangeWalletAddress = "EHaz4Hvce6JzV1nfdSETd7jbxtL2c2KxVYPVMiseKeZj";
const UsdcDevnetMintAuthority = "GrNg1XM2ctzeE2mXxXCfhcTUbejM8Z4z4wNVTy2FjMEz";

const ExchangeWalletFilePath = '/Users/struong/soltoshi/wallets/exchange.json';

const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)
const connection = new Connection(endpoint)

const feePayer = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(readFileSync(ExchangeWalletFilePath, "utf-8")))
)

async function main() {
  console.log("> Setting up mint for devnet usdc");
  const mint = await TokenMint.init(connection, feePayer, 6, new PublicKey(UsdcDevnetMintAuthority));

  console.log("> Getting token associated account for ", ExchangeWalletAddress);
  const ata = await mint.getAssociatedTokenAccount(new PublicKey(ExchangeWalletAddress));

  console.log("> Minting USDC to", ExchangeWalletAddress);
  const txId = await mint.mintInto(ata, 1000);

  console.log("> Mint tx id", txId);
}

main();
