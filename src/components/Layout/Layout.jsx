import React from 'react';
import { Outlet } from 'react-router-dom';

import { Layout as AntdLayout } from 'antd';
import styles from './Layout.module.css';

// eslint-disable-next-line import/no-unresolved
import Navbar from '../Navbar/Navbar';
import { useAuthContext } from '../../common/AuthContext';

const { Content } = AntdLayout;

const Layout = () => {
  const { currentUser } = useAuthContext();
  return (
    <AntdLayout hasSider>
      <Navbar
        isAdmin={currentUser != null && currentUser.role === 'admin'}
        className={styles.sider}
      />
      <Content className={styles.content}>
        <div>
          <Outlet />
        </div>
      </Content>
    </AntdLayout>
  );
};

export default Layout;
