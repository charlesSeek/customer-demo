import React, { useEffect } from "react";
import { Table } from "antd";
import { useCustomers } from '../../hooks/useCustomers'

const API_URL = process.env.REACT_APP_API_URL || 'https://zbqkw071ce.execute-api.ap-southeast-2.amazonaws.com/dev'

const CustomerTable: React.FC = () => {
  const { state, dispatch } = useCustomers();
  const { customers, search, startDate, endDate, pageSize, page, order } = state;
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Replace this URL with your actual API endpoint
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
      } finally {
        // setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, pageSize, order, search, startDate, endDate, dispatch]);
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
