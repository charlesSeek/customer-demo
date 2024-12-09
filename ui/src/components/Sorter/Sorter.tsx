import React from "react";
import { Select, Row, Col, Typography } from "antd";
import { useCustomers } from '../../hooks/useCustomers'

const { Option } = Select;
const { Text } = Typography;

const Sorter: React.FC = () => {
  const { state, dispatch } = useCustomers();
  const { pageSize,  order } = state;

  const handleOrderChange = (value: string) => {
    dispatch({ type: 'SET_PAGE', payload: 0 });
    dispatch({ type: 'SET_ORDER', payload: value });
    
  };

  const handlePageSizeChange = (value: number) => {
    dispatch({ type: 'SET_PAGE', payload: 0 });
    dispatch({ type: 'SET_PAGE_SIZE', payload: value });
  };

  return (
    <Row align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
      {/* Order Dropdown */}
      <Col>
        <Text strong>Order:</Text>
        <Select
          value={order}
          style={{ width: 120, marginLeft: 8 }}
          onChange={handleOrderChange}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </Col>

      {/* Page Size Dropdown */}
      <Col>
        <Text strong>Page Size:</Text>
        <Select
          value={pageSize}
          style={{ width: 120, marginLeft: 8 }}
          onChange={handlePageSizeChange}
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
        </Select>
      </Col>
    </Row>
  );
};

export default Sorter;
