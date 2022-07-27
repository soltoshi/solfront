import Head from "next/head";
import Image from "next/image";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Coming soon</title>
        <meta name="description" content="Solfront" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Coming soon
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://solana.com/summercamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          🏝 Brought to you by Solana Summer Camp 😎
        </a>
      </footer>
    </div>
  );
}
