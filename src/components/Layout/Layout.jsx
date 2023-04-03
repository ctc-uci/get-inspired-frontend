import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

// eslint-disable-next-line import/no-unresolved
import Navbar from '../Navbar/Navbar';

const Layout = ({ isAdmin }) => (
  <div className={styles.wrapper}>
    <div className={styles.navbar}>
      <Navbar isAdmin={isAdmin} />
    </div>
    <div className={styles.layout}>
      <Outlet />
    </div>
  </div>
);

Layout.propTypes = {
  isAdmin: PropTypes.bool,
};

Layout.defaultProps = {
  isAdmin: false,
};

export default Layout;
