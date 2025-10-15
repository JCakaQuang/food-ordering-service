'use client';

import React from 'react';
import { App } from 'antd';

/**
 * Component này bao bọc các children bằng <App> của Ant Design.
 * Điều này cung cấp context cần thiết cho các component như message, notification, Modal.
 */
const AntdAppProvider = ({ children }: { children: React.ReactNode }) => {
  return <App>{children}</App>;
};

export default AntdAppProvider;
