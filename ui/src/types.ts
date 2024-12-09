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