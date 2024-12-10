import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Filter from './Filter';
import userEvent from '@testing-library/user-event';
import { AppStateContext, initialState } from '../../hooks/useCustomers';
import { ProviderProps } from '../../types';

describe('Sorter Component', () => {
  let mockDispatch: any;
  let mockProviderProps: ProviderProps;
  beforeEach(() => {
    mockDispatch = jest.fn();
    mockProviderProps = {
      state: {
        ...initialState,
        total: 100,
      },
      dispatch: mockDispatch,
    }
  })
  it('should render Filter component properly', async () => {
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Filter />
      </AppStateContext.Provider>
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End date')).toBeInTheDocument();
  });

  it('should handle search input change correctly', async () => {
    
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Filter />
      </AppStateContext.Provider>
    );

    const input = screen.getByPlaceholderText('Search...');
    userEvent.type(input, 'test');
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_SEARCH', payload: 'test' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PAGE', payload: 0 });
  });

  it('should handle date change correctly', async () => {
    
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Filter />
      </AppStateContext.Provider>
    );
  
    const startDateInput = screen.getByPlaceholderText('Start date');
    const endDateInput = screen.getByPlaceholderText('End date');
    await userEvent.type(startDateInput, '2024-12-01');
    userEvent.tab();
    await userEvent.type(endDateInput, '2024-12-10');
    userEvent.tab();
    
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PAGE', payload: 0}));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_START_DATE', payload: '2024-12-01'}));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_END_DATE', payload: '2024-12-10'}));
  });

});
