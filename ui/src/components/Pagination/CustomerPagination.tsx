import React from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useCustomers } from '../../hooks/useCustomers'

const CustomerPagination: React.FC = () => {
  const { state, dispatch } = useCustomers();
  const { total, pageSize, page } = state;
  const onChange: PaginationProps['onChange'] = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page - 1 })
  };
  return (
    <Pagination
      defaultCurrent={1}
      total={total} 
      pageSize={pageSize}
      showSizeChanger={false}
      onChange={onChange}
      current={page + 1}
    />
  );
}

export default CustomerPagination;