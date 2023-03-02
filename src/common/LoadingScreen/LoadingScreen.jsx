import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import styles from './LoadingScreen.module.css';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 80,
    }}
    spin
  />
);
const LoadingScreen = () => (
  <div className={styles['loading-screen']}>
    <div className={styles.content}>
      <Spin indicator={antIcon} />
    </div>
  </div>
);
export default LoadingScreen;
