import { getPythProgramKeyForCluster, PythHttpClient, PriceStatus } from "@pythnetwork/client";
import { PythCluster, getPythClusterApiUrl } from "@pythnetwork/client/lib/cluster";
import { Connection } from "@solana/web3.js";

const SOLANA_CLUSTER_NAME: PythCluster = 'devnet';
const SOL_USD_PYTH_SYMBOL = 'Crypto.SOL/USD';
const pythConnection = new Connection(getPythClusterApiUrl(SOLANA_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME);

async function main() {
  // Get the current SOL/USD price from Pyth
  const pythData = await new PythHttpClient(pythConnection, pythPublicKey).getData();
  const solUsdPrice = pythData.productPrice.get(SOL_USD_PYTH_SYMBOL).price;
  const priceStatus = PriceStatus[pythData.productPrice.get(SOL_USD_PYTH_SYMBOL).status];
  console.log('[make_transaction] got data from Pyth', {solUsdPrice, priceStatus});
}

main()