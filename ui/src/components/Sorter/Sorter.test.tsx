import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sorter from './Sorter';
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
  it('should render component properly', async () => {
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Sorter />
      </AppStateContext.Provider>
    );
    expect(screen.getByText('Order:', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText('Page Size:', { selector: 'strong' })).toBeInTheDocument();
  })

  it('should handle order change correctly', async () => {
    
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Sorter />
      </AppStateContext.Provider>
    );

    fireEvent.mouseDown(await screen.findByTestId('order-select'));
    expect(await screen.findByText('Descending')).toBeInTheDocument()
  });

  it('should handle pageSize change correctly', async () => {
    
    render(
      <AppStateContext.Provider value = { mockProviderProps}>
        <Sorter />
      </AppStateContext.Provider>
    );

    fireEvent.mouseDown(await screen.findByTestId('page-size-select'));
    expect(await screen.findByText('10')).toBeInTheDocument();
  });
});
