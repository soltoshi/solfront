import { Box, Image, Center, Container, Text, Heading, Link, VStack, HStack, Img} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import LandingNav from "../components/LandingNav";
import { GithubIcon, TwitterIcon } from "../components/icons";

const BulletCard = ({children}) => {
  return (
    <VStack
      spacing={3}
      boxShadow={'base'}
      rounded={'base'}
      bgColor={'whiteAlpha.500'}
      padding={4}
      height={'33vh'}
      width={'25vh'}
    >
      {children}
    </VStack>
  );
}

const howItWorksContent = [
  {
    text: 'Create a payment link',
    img: '/create_link.png'
  },
  {
    text: 'Customer checks out via link',
    img: '/pay.png'
  },
  {
    text: 'Collect via Solana Pay',
    img: '/checkout.png'
  },
]

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solfront</title> <meta name="description" content="Solfront
        enables your business to effortlessly create payment links, accept
        cryptocurrency for USD, and incentivize your customers to come back." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LandingNav/>
      <Box
        padding={'2rem 2rem'}
        bgColor={'gray.50'}
        height={'100%'}
      >
        <VStack spacing={12}>

          {/* HERO */}
          <Heading width={'80vh'} size={'3xl'} textAlign={'center'} display={'inline-block'}>
            The{" "}
            <Text
              as={'span'}
              // bgGradient={'linear(to-l, #7928CA, #FF0080)'}
              bgGradient={'linear(to-l, gray.500, gray.700, gray.600)'}
              bgClip={'text'}
              fontWeight={'bold'}
            >
              no-code commerce platform
            </Text>
            {" "}for
            <Text
              as={'span'}
              bgGradient={'linear(to-l, #03ce8f, #5089c7, #9649fd)'}
              bgClip={'text'}
              fontWeight={'bold'}
            >{" "}Solana</Text>
          </Heading>

          <Text width={'60vh'} fontSize={'2xl'} textAlign={'center'} fontWeight={'medium'} color={'gray.700'}>
            Accept Solana payments and receive USD without writing a single line
            of code. Engage your customers by tailoring unique NFT-powered
            incentive programs with Solfront.
          </Text>

          {/* HOW IT WORKS */}
          <VStack spacing={6}>
            <Heading
              size={'lg'}
              fontWeight={'bold'}
            >
              How it works
            </Heading>
            <VStack spacing={12}>
              {
                howItWorksContent.map((content) => {
                  return (
                    <VStack
                      key={content.img}
                      p={0}
                      spacing={0}
                    >
                      <Text
                        fontWeight={'bold'}
                        fontSize={'sm'}
                        bgGradient={'linear(to-l, #7928CA, #FF0080)'}
                        bgClip={'text'}
                      >
                        {content.text}
                      </Text>
                      <Image
                        // rounded={'lg'}
                        height={500}
                        width={'100%'}
                        // objectFit={'cover'}
                        boxShadow={'none'}
                        src={content.img}
                        alt={''}
                      />
                    </VStack>
                  );
                })
              }
            </VStack>
          </VStack>
        </VStack>
      </Box>

      {/* FOOTER */}

      <Box boxShadow={'inner'} bgColor={'gray.50'} borderColor={'gray.50'} height={'20vh'}>
        <VStack spacing={0.5} py={6} ml={4}>
          <Heading size={'sm'} textAlign={'left'}>
            Made with ❤️ for web3
          </Heading>
          <Link
            href="https://solana.com/summercamp"
            _hover={{'text-decoration': 'none'}}
            fontSize={'xs'}
          >
            Brought to you by
            <Text
              as={'span'}
              bgGradient={'linear(to-l, #03ce8f, #5089c7, #9649fd)'}
              bgClip={'text'}
              fontWeight={'bold'}
            >
              {" "}Solana Summer Camp
            </Text>
          </Link>

          <HStack spacing={2}>
            <Link href="https://twitter.com/usesolfront">
              <TwitterIcon color={'gray.700'}/>
            </Link>
            <Link href="https://github.com/soltoshi/">
              <GithubIcon color={'gray.700'}/>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </>
  );
}

export default Home;
