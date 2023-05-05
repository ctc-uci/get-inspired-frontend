import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import { Layout as AntdLayout } from 'antd';
import styles from './Layout.module.css';

// eslint-disable-next-line import/no-unresolved
import Navbar from '../Navbar/Navbar';
import { useAuthContext } from '../../common/AuthContext';

const { Content } = AntdLayout;

const Layout = ({ isAdmin }) => {
  console.log({ isAdmin });
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

Layout.propTypes = {
  isAdmin: PropTypes.bool,
};

Layout.defaultProps = {
  isAdmin: false,
};

export default Layout;
