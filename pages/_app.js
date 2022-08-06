import "../styles/globals.css";
import { PayContextProvider } from "../context/PayContext";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import Head from "next/head";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function MyApp({ Component, pageProps }) {
  // Solana network to use
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChakraProvider>
            {/* TODO: we really only want to render this for payment pages */}
            <PayContextProvider>
              <Layout>
                <Head>
                  <title>Solfront</title>{" "}
                  <meta
                    name="description"
                    content="Solfront
                  enables your business to effortlessly create payment links, accept
                  cryptocurrency for USD, and incentivize your customers to come back."
                  />
                  <link rel="icon" href="/favicon.ico" />
                </Head>
                <Component {...pageProps} />
              </Layout>
            </PayContextProvider>
          </ChakraProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
