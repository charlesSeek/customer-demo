export interface Customer {
  id: string;
  fullName: string;
  email: string;
  registrationDate: string;
}

export interface CustomerContextState {
  customers: Array<Customer>;
  search: string;
  startDate: string;
  endDate: string;
  pageSize: number;
  page: number;
  order: string;
  total: number;
  totalPage: number;
}

export type Action =
  | { type: "SET_CUSTOMERS"; payload: {items: Customer[], total: number, totalPage: number} }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_ORDER"; payload: string };

export interface ProviderProps {
  state: CustomerContextState;
  dispatch: React.Dispatch<Action>;
}