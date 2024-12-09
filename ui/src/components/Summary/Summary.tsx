import React from 'react';
import { Typography, Space } from 'antd';

const { Text } = Typography;

interface Props {
  total: number;
  pageSize: number;
  totalPage: number;
}

const SummaryComponent = ({ total, pageSize, totalPage }: Props) => {
    return (
        <Space direction="vertical">
            <Text>Total Customers: <strong>{total}</strong></Text>
            <Text>Page Size: <strong>{pageSize}</strong></Text>
            <Text>Total Pages: <strong>{totalPage}</strong></Text>
        </Space>
    );
};

export default SummaryComponent;