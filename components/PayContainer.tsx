import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Text, Box, Center, Link } from "@chakra-ui/react";

const PayContainer = ({children}) => {
  return (
    <>
      <Box backgroundColor={"gray.50"} minH={'100vh'}>
        <Box
          padding={24}
          marginBottom={48}
          minH={'75vh'}
        >
          <Center>
            {children}
          </Center>
        </Box>

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
      </Box>
    </>
  )
 }

 export default PayContainer;
