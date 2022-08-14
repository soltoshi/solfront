import {
  Table,
  TableCaption,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';
import { PaymentState } from '../state/payment';
import { renderEpochSeconds } from '../state/util/time';

interface PaymentData {
  id: string;
  created: number;
  amount: number;
  state: string;
}

interface PaymentsTableProps {
  data: DocumentData[]
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

export default function PaymentsTable(props: PaymentsTableProps) {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Created</Th>
            <Th isNumeric>Amount</Th>
            <Th>State</Th>
          </Tr>
        </Thead>

        {
          props.data.map((snapshot) => {
            const data = snapshot.data();
            return (
              <Tr
                key={snapshot.id}
              >
                <Td>{snapshot.id}</Td>
                <Td>{renderEpochSeconds(data.created)}</Td>
                <Td isNumeric>{data.amount}</Td>
                <Td>{PaymentState[data.state]}</Td>
              </Tr>
            )
          })
        }

      </Table>
    </TableContainer>
  );
}
