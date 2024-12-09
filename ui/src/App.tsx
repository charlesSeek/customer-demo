import React from "react";
import { Layout } from "antd";
import Home from './pages/Home'

const { Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <Home />
      </Content>
    </Layout>
  );
};

export default App;
