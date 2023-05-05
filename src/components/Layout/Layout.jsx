import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import { Layout as AntdLayout } from 'antd';
import styles from './Layout.module.css';

// eslint-disable-next-line import/no-unresolved
import Navbar from '../Navbar/Navbar';

const { Content } = AntdLayout;

const Layout = ({ isAdmin }) => (
  <AntdLayout hasSider>
    <Navbar isAdmin={isAdmin} className={styles.sider} />
    <Content className={styles.content}>
      <div>
        <Outlet />
      </div>
    </Content>
  </AntdLayout>
  // <div className={styles.wrapper}>
  //   <div className={styles.navbar}>
  //   </div>
  //   <div className={styles.layout}>
  //     <Outlet />
  //   </div>
  // </div>
);

Layout.propTypes = {
  isAdmin: PropTypes.bool,
};

Layout.defaultProps = {
  isAdmin: false,
};

export default Layout;
