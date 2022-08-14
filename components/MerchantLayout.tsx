import { ReactElement } from 'react';
import { AuthContextProvider } from '../context/AuthContext'
import Layout from './Layout';

const MerchantLayout = ({children}) => {
  return (
    <AuthContextProvider>
      <Layout>
        {children}
      </Layout>
    </AuthContextProvider>
  );
}

function renderWithMerchantLayout(page: ReactElement) {
  return (
    <MerchantLayout>
      {page}
    </MerchantLayout>
  );
}

export default renderWithMerchantLayout;
