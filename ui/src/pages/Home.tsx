import React from 'react';
import Filter from '../components/Filter/Filter';
import Sorter from '../components/Sorter/Sorter';
import CustomerTable from '../components/CustomerTable/CustomerTable';
import Pagination from '../components/Pagination/CustomerPagination';
import Summary from '../components/Summary/Summary';
import { Space, Divider } from 'antd';
import { useCustomers } from '../hooks/useCustomers';

const Home = () => {
  const { state } = useCustomers();
  const { total, totalPage, pageSize } = state;
  return (
    <Space direction="vertical" size="middle" split={<Divider type="vertical" />}>
      <Filter/>
      <Sorter />
      <Summary total={total} totalPage={totalPage} pageSize={pageSize}/>
      <CustomerTable />
      <Pagination />
    </Space>
  )
}
export default Home;