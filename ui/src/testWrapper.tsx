import React, { ReactNode} from 'react';
import { AppStateProvider } from './hooks/useCustomers';

const TestWrapper = ({ children }: { children: ReactNode}) => {
  return (
    <AppStateProvider>
      {children}
    </AppStateProvider>
  );
};

export default TestWrapper;
