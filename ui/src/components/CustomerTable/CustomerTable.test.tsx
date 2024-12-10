import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerTable from './CustomerTable';
import { initialState, AppStateContext } from '../../hooks/useCustomers';
import { ProviderProps } from '../../types';

const mockData = [
  { 
    id: 1, 
    fullName: 'John Doe',
    email: 'john@example.com',
    registrationDate: '2020-01-01' 
  }
]

describe('CustomerTable', () => {
  let mockProviderProps: ProviderProps;
  let mockDispatch = jest.fn();
  beforeEach(() => {
    mockProviderProps = {
      state: initialState,
      dispatch: mockDispatch,
    };
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData) ,
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show spin properly', async () => {
      render(
        <AppStateContext.Provider value = { mockProviderProps }>
          <CustomerTable />
        </AppStateContext.Provider>
      );
      expect(await screen.findByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error message when fetch data fail', async() => {
    global.fetch = jest.fn().mockRejectedValueOnce({
      message: 'error'
    });
    render(
      <AppStateContext.Provider value = { mockProviderProps }>
        <CustomerTable />
      </AppStateContext.Provider>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Fetch customers fail, pleas try again.')).toBeInTheDocument();
  });

  it('fetches customers and displays them in a table', async () => {
    render(
      <AppStateContext.Provider value = { mockProviderProps }>
        <CustomerTable />
      </AppStateContext.Provider>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_CUSTOMERS', payload: mockData });
  });
});
