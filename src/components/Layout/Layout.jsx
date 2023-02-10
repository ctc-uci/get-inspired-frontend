import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

import styles from './Layout.module.css';

import NavBar from '../NavBar/NavBar';

const Layout = ({ isAdmin }) => (
  <div className={styles.wrapper}>
    <div className={styles.navbar}>
      <NavBar isAdmin={isAdmin} />
    </div>
    <div className={styles.layout}>
      <Outlet />
    </div>
  </div>
);

Layout.defaultProps = {
  isAdmin: false,
};

Layout.propTypes = {
  isAdmin: PropTypes.bool,
};

export default Layout;
