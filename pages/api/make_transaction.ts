import { PriceStatus, PythHttpClient } from "@pythnetwork/client"
import { getPythClusterApiUrl, getPythProgramKeyForCluster, PythCluster } from "@pythnetwork/client/lib/cluster"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { NextApiRequest, NextApiResponse } from "next"
import { shopAddress } from "../../lib/addresses"
import BigNumber from "bignumber.js";

const SOLANA_CLUSTER_NAME: PythCluster = 'devnet';
const SOL_USD_PYTH_SYMBOL = 'Crypto.SOL/USD';
const pythConnection = new Connection(getPythClusterApiUrl(SOLANA_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME);

export type MakeTransactionInputData = {
  account: string,
  reference: string,
  price: number,
  paymentLink: string,
}

export type MakeTransactionOutputData = {
  transaction: string,
  message: string,
  solPrice: number,
}

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>
) {
  console.log('[make_transaction] received request with body', JSON.stringify(req.body));

  try {
    const {account, reference, price} = req.body as MakeTransactionInputData;

    // We pass the selected items in the query, calculate the expected cost
    if (price === 0) {
      res.status(400).json({ error: "Can't checkout with charge of 0" })
      return
    }

    // We pass the reference to use in the query
    if (!reference) {
      res.status(400).json({ error: "No reference provided" })
      return
    }

    // We pass the buyer's public key in JSON body
    if (!account) {
      res.status(40).json({ error: "No account provided" })
      return
    }
    const buyerPublicKey = new PublicKey(account);
    const shopPublicKey = shopAddress;

    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await (connection.getLatestBlockhash('finalized'))

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      // The buyer pays the transaction fee
      feePayer: buyerPublicKey,
    });

    // Get the current SOL/USD price from Pyth
    const pythData = await new PythHttpClient(pythConnection, pythPublicKey).getData();
    const solUsdPrice = pythData.productPrice.get(SOL_USD_PYTH_SYMBOL).price;
    const priceStatus = PriceStatus[pythData.productPrice.get(SOL_USD_PYTH_SYMBOL).status];
    console.log('[make_transaction] got data from Pyth', {solUsdPrice, priceStatus});

    // Create the instruction to send SOL from the buyer to the shop

    // SOL price = product price / SOLUSD price
    const priceInSol = price / solUsdPrice;
    const transferInstruction = SystemProgram.transfer({
      lamports: Math.round(priceInSol * LAMPORTS_PER_SOL),
      fromPubkey: buyerPublicKey,
      toPubkey: shopPublicKey,
    })

    console.log(
      '[make_transaction] generated transfer instruction',
      {
        priceInSol,
        fromAddr: buyerPublicKey.toString(),
        toAddr: shopPublicKey.toString(),
      }
    );


    // Add the reference to the instruction as a key
    // This will mean this transaction is returned when we query for the reference
    transferInstruction.keys.push({
      pubkey: new PublicKey(reference),
      isSigner: false,
      isWritable: false,
    })

    // Add the instruction to the transaction
    transaction.add(transferInstruction)

    // Serialize the transaction and convert to base64 to return it
    const serializedTransaction = transaction.serialize({
      // We will need the buyer to sign this transaction after it's returned to them
      requireAllSignatures: false
    })
    const base64 = serializedTransaction.toString('base64')

    // Insert into database: reference, amount

    // Return the serialized transaction
    res.status(200).json({
      transaction: base64,
      message: "Thanks for your order! 🍪",
      solPrice: priceInSol,
    })
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'error creating transaction', })
    return
  }
}