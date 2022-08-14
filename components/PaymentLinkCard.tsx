import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

// TODO: make this image configurable
const IMAGE = 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface PaymentLinkCardProps {
  link: string;
  productName: string;
  price: string;
  currency: string;

  // for customizing appearance
  offset?: boolean;
}

function formatPrice(price: string, currency: string): string {
  if (currency == 'USD') {
    return `$${price}`;
  } else if (currency == 'SOL') {
    return `${price} SOL`;
  } else {
    throw new Error("unexpected currency");
  }
}

function getSlugFromLink(link: string) {
  const tokens = link.split('/')
  return tokens[1];
}

export default function PaymentLinkCard(props: PaymentLinkCardProps) {
  const router = useRouter();

  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
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
            objectFit={'cover'}
            src={IMAGE}
            alt={''}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'}>
            <NextLink href={
              // we do this check since we test locally
              window.location.hostname == 'localhost' ?
                `http://localhost:3000/pay/${getSlugFromLink(props.link)}` :
                `https://${props.link}`
              }>
              {props.link}
            </NextLink>
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {props.productName}
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              {formatPrice(props.price, props.currency)}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
