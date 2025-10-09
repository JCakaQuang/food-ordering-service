import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footerapp: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
      <p>FoodLighting ©2025 Created </p>
    </AntFooter>
  );
};

export default Footerapp;