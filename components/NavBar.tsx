import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';

import NextLink from "next/link";
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useAuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {isLoggedIn, handleSignOut} = useAuthContext();
  const loggedIn = isLoggedIn();

  const renderLoggedInNav = () => {
    return (
      <>
        <NextLink href='/create_link' passHref>
          <Button
            as="a"
            variant={'solid'}
            colorScheme={'teal'}
            size={'md'}
            mr={4}
            _hover={{
              bgColor: 'teal.500',
            }}
            bgColor='teal.400'
            leftIcon={<AddIcon />}>
            Create payment link
          </Button>
        </NextLink>

        <NextLink href='/payouts' passHref>
          <Button
            as="a"
            variant={'solid'}
            colorScheme={'teal'}
            size={'md'}
            mr={4}
            _hover={{
              bgColor: 'blue.500',
            }}
            bgColor='blue.400'
          >
            View payouts
          </Button>
        </NextLink>

        <Menu>
          <MenuButton
            as={Button}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
            boxSize={12}
            _hover={{
              textDecoration: 'none',
              bg: 'gray.200',
            }}
          >
            <HamburgerIcon
              color={'black'}
              boxSize={4}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleSignOut}>
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );

  }

  return (
    <>
      <Box bg={'gray.50'} px={4} padding={8}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            {/* <Box>🚪</Box> */}
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
                href={loggedIn ? '/dashboard' : '/'}>
                  Solfront.
              </Link>
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {
              loggedIn ? renderLoggedInNav() : <></>
            }
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
