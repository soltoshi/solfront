import NavBar from "./NavBar"
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Text, Box, Center, Link } from "@chakra-ui/react";
import withTransition from "./withTransition";

const Layout = ({children}) => {
  return (
    <>
      <NavBar />

      <main>
        <Box
          padding={'2rem 2rem'}
          minH={'100vh'}
          bgColor={'gray.50'}
          maxWidth={'100%'}
        >
          <Center>
            <Box maxWidth={'75%'}>
              {children}
            </Box>
          </Center>
        </Box>
      </main>

      <Box boxShadow={'inner'} borderColor={'gray.50'} height={'100%'}>
        <footer className={styles.footer}>
          <Center h={'inherit'}>
            <Link
              href="https://solfront.app/"
              _hover={{'text-decoration': 'none'}}
              fontSize={'xs'}
            >
              Powered by
              <Text
                bgGradient={'linear(to-l, #7928CA, #FF0080)'}
                bgClip={'text'}
                fontWeight={'bold'}
                fontSize={'sm'}
                marginLeft={1}
              >
                Solfront
              </Text>
            </Link>
          </Center>
        </footer>
      </Box>
    </>
  )
 }

 export default withTransition(Layout);
