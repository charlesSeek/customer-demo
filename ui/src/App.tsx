import React from "react";
import { Layout } from "antd";
import Home from './pages/Home'
import './App.css'; 

const { Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Content className="responsive-content">
        <Home />
      </Content>
    </Layout>
  );
};

export default App;
