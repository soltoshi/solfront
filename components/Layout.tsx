import NavBar from "./NavBar"
import Image from "next/image";
import styles from "../styles/Home.module.css";

 const Layout = ({children}) => {
  return (
    <div className={styles.container}>
      <NavBar />

      <main>
        {children}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
 }

 export default Layout;
