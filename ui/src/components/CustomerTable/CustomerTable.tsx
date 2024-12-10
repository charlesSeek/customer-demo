import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useCustomers } from '../../hooks/useCustomers'
import { Spin, Alert } from 'antd';

const API_URL = process.env.REACT_APP_API_URL || 'https://zbqkw071ce.execute-api.ap-southeast-2.amazonaws.com/dev'

const CustomerTable: React.FC = () => {
  const [loading, setLoading ] = useState<boolean>(false);
  const [error, setError] = useState<string| null>(null);
  const { state, dispatch } = useCustomers();
  const { customers, search, startDate, endDate, pageSize, page, order } = state;
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_URL}/customers?page=${page}&pageSize=${pageSize}&order=${order}&search=${search}&startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();

        // Update the customers in the context
        dispatch({ type: "SET_CUSTOMERS", payload: data });
      } catch (err: any) {
        console.error(err);
        setError('Fetch customers fail, pleas try again.')
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
    
  }, [page, pageSize, order, search, startDate, endDate, dispatch, setLoading]);
  const columns = [
    {
      title: "Customer ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
    },
  ];
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Spin size="large" data-testid="spinner"/>
      </div>
    );
  }
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div style={{ padding: 24 }}>
      <h2>Customer List</h2>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default CustomerTable;
