import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
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

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  const renderWithLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider>
      <Head>
        <title>Solfront</title>
        <meta
          name="description"
          content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      { renderWithLayout(<Component {...pageProps} key={ router.route }/>) }
    </ChakraProvider>
  );
}

export default MyApp;
