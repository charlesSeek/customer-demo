import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryComponent from './Summary';

describe('SummaryComponent', () => {
  it('renders the total customers correctly', () => {
    render(<SummaryComponent total={150} pageSize={10} totalPage={15} />);
    const totalCustomers = screen.getByText(/Total Customers:/i);
    expect(totalCustomers).toHaveTextContent('Total Customers: 150');
  });

  it('renders the page size correctly', () => {
    render(<SummaryComponent total={150} pageSize={10} totalPage={15} />);
    const pageSize = screen.getByText(/Page Size:/i);
    expect(pageSize).toHaveTextContent('Page Size: 10');
  });

  it('renders the total pages correctly', () => {
    render(<SummaryComponent total={150} pageSize={10} totalPage={15} />);
    const totalPages = screen.getByText(/Total Pages:/i);
    expect(totalPages).toHaveTextContent('Total Pages: 15');
  });
});
