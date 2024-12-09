import React from "react";
import { Input, DatePicker, Row, Col, Space, Typography } from "antd";
import { useCustomers } from '../../hooks/useCustomers';
import type { RangePickerProps } from "antd/es/date-picker";
import { format } from 'date-fns';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const FilterComponent: React.FC = () => {
  const { dispatch } = useCustomers();
  const handleRangeChange: RangePickerProps["onChange"] = (_, dateStrings) => {
    if (dateStrings.length === 2) {
      const now = format(new Date(), "yyyy-MM-dd");
      const startDate = dateStrings[0] === '' ? '1900-01-01' : dateStrings[0];
      const endDate = dateStrings[1] === '' ? now : dateStrings[1];
      dispatch({ type: 'SET_PAGE', payload: 0});
      dispatch({ type: 'SET_START_DATE', payload: startDate });
      dispatch({ type: 'SET_END_DATE', payload: endDate});
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value.toLowerCase() })
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Title level={4}>Filters</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Input
            placeholder="Search..."
            onChange={handleSearch}
          />
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handleRangeChange}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default FilterComponent;
