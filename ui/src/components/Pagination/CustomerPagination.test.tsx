import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerPagination from './CustomerPagination';
import { AppStateContext, initialState } from '../../hooks/useCustomers';
import { ProviderProps } from '../../types';

describe('CustomerPagination Component', () => {
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
  
  it('renders pagination component properly when total equal 100', () => {

    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <CustomerPagination />
      </AppStateContext.Provider>
    );
    expect(screen.getByTitle('10')).toBeInTheDocument();
  });

  it('dispatches the correct action on page change', () => {
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <CustomerPagination />
      </AppStateContext.Provider>
    );

    const pageTwoButton = screen.getByTitle(2);
    fireEvent.click(pageTwoButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PAGE', payload: 1 });
  })
});