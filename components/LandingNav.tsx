import { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';

import NextLink from "next/link";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = ['Solfront.'];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    fontWeight={'bold'}
    href={'/'}>
    {children}
  </Link>
);

export default function LandingNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={'gray.50'} px={4} padding={8}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <Link
                px={8}
                py={4}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                fontWeight={'bold'}
                href={'/'}>
                  Solfront.
              </Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <NextLink href='/dashboard' passHref>
              <Button
                as="a"
                variant={'solid'}
                colorScheme={'teal'}
                size={'sm'}
                mr={4}
              >
                Enter app
              </Button>
            </NextLink>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
