import "../styles/globals.css";
import { PayContextProvider } from "../context/PayContext";
import { AuthContextProvider } from "../context/AuthContext";
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
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const renderWithLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider>
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

      { renderWithLayout(<Component {...pageProps} />) }

    </ChakraProvider>
  );
}

export default MyApp;
