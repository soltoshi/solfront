import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Link,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

// TODO: make this image configurable
const IMAGE = 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface PaymentLinkCardProps {
  link: string;
  productName: string;
  price: string;
  currency: string;

  // for customizing appearance
  offset?: boolean;

  // for turning it into a link
  onClick?: (event) => void;
}

function formatPrice(price: string, currency: string): string {
  if (currency == 'USD') {
    return `$${price}`;
  } else if (currency == 'SOL') {
    return `${price} SOL`;
  } else {
    throw new Error(`Unexpected currency: ${currency}`);
  }
}

function getSlugFromLink(link: string) {
  const tokens = link.split('/')
  return tokens[1];
}

export default function PaymentLinkCard(props: PaymentLinkCardProps) {
  const router = useRouter();
  const [payLinkHref, setPayLinkHref] = useState<string>('');

  const optCursorProp = {} as {cursor?: string};
  if (props.onClick) {
    optCursorProp.cursor = 'pointer';
  }

  useEffect(() => {
    // we do this check since we test locally
    if ('localhost' == window.location.hostname) {
      setPayLinkHref(`http://localhost:3000/pay/${getSlugFromLink(props.link)}`);
    } else {
      setPayLinkHref(`https://solfront.app/${getSlugFromLink(props.link)}`)
    }
  }, [props.link])

  return (
    <Center
      onClick={(event) => {
        event.preventDefault();
        console.log("card clicked!");

        if (props.onClick) {
          props.onClick(event);
        }
      }}
    >
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'sm'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={props.offset ? -12 : 0}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${IMAGE})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            {...optCursorProp}
            objectFit={'cover'}
            src={IMAGE}
            alt={''}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'}>
            <NextLink href={payLinkHref}>
              {props.link}
            </NextLink>
          </Text>
          <VStack {...optCursorProp}>

            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
              {props.productName}
            </Heading>
            <Stack direction={'row'} align={'center'}>
              <Text fontWeight={800} fontSize={'xl'}>
                {formatPrice(props.price, props.currency)}
              </Text>
            </Stack>
          </VStack>
        </Stack>
      </Box>
    </Center>
  );
}
