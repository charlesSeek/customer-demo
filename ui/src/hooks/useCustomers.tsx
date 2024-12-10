import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CustomerContextState } from '../types';
import { format } from 'date-fns';
import { Action } from '../types'

const now = format(new Date(), "yyyy-MM-dd");

export const initialState: CustomerContextState = {
  customers: [],
  search: "",
  startDate: "1900-01-01",
  endDate: now,
  pageSize: 10,
  page: 0,
  order: "desc",
  total: 0,
  totalPage: 0,
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const customerReducer = (state: CustomerContextState, action: Action): CustomerContextState => {
  switch (action.type) {
    case "SET_CUSTOMERS":
      return { 
        ...state, 
        customers: action.payload.items, 
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload };
    default:
      return state;
  }
};

// Create Context
export const AppStateContext = createContext<{
  state: CustomerContextState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useCustomers = () => {
  return useContext(AppStateContext);
};
