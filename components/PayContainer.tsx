import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Center } from "@chakra-ui/react";

const PayContainer = ({children}) => {
  return (
    <>
      <Box backgroundColor={"gray.100"}>
        <Box
          padding={24}
          marginBottom={48}
          minHeight={'100vh'}
        >
          <Center>
            {children}
          </Center>
        </Box>

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
      </Box>
    </>
  )
 }

 export default PayContainer;
