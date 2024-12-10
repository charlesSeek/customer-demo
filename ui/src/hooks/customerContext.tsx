import React, { createContext } from 'react';
import { CustomerContextState, Customer } from '../types';

const initialState: CustomerContextState = {
  customers: [],
  search: "",
  startDate: "1900-01-01",
  endDate: "2024-12-10",
  pageSize: 10,
  page: 0,
  order: "desc",
  total: 0,
  totalPage: 0,
};

const AppStateContext = createContext<CustomerContextState>(initialState);

export default AppStateContext;

