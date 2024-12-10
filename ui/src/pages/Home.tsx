import React from 'react';
import { 
  Filter,
  Sorter,
  CustomerTable,
  CustomerPagination,
  Summary
} from '../components/';
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
      <CustomerPagination />
    </Space>
  )
}
export default Home;