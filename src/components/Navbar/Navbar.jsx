import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  HomeOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  SearchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import LogoutModal from './LogoutModal/LogoutModal';

import GSPLogo from '../../assets/images/GSPLogo.svg';

import styles from './Navbar.module.css';

const SIDER_WIDTH = 200;

const { Sider } = Layout;
const { Title } = Typography;

const PATH_TO_KEYS = {
  '/': ['dashboard'],
  '/manage-columns': ['manage-columns'],
  '/add-data': ['add-data'],
  '/query-data': ['query-data'],
  '/manage-data': ['manage-data'],
  '/manage-users': ['manage-users'],
  '/profile': ['profile'],
};

const Navbar = ({ isAdmin }) => {
  const location = useLocation();
  const path = location.pathname;

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(PATH_TO_KEYS[path]);

  useEffect(() => {
    setSelectedKeys(PATH_TO_KEYS[path]);
  }, [location]);

  return (
    <Sider width={SIDER_WIDTH} className={styles.sider} theme="light">
      <LogoutModal isOpen={isLogoutModalOpen} setIsOpen={setIsLogoutModalOpen} />
      <div className={styles['sider-wrapper']}>
        <div className={styles['logo-wrapper']}>
          <img src={GSPLogo} alt="GSP Logo" className={styles['logo-picture']} />
          <Title className={styles['logo-text']} level={5}>
            Get Inspired
          </Title>
        </div>
        <Menu mode="inline" selectedKeys={selectedKeys} style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="manage-columns" icon={<DatabaseOutlined />}>
            <Link to="/manage-columns">Manage Columns</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="add-data" icon={<FileAddOutlined />}>
              <Link to="/add-data">Add Data</Link>
            </Menu.Item>
          )}
          <Menu.Item key="manage-data" icon={<AppstoreOutlined />}>
            <Link to="/manage-data">Manage Data</Link>
          </Menu.Item>
          <Menu.Item key="query-data" icon={<SearchOutlined />}>
            <Link to="/query-data">Query Data</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="manage-users" icon={<UsergroupAddOutlined />}>
              <Link to="/manage-users">Manage Users</Link>
            </Menu.Item>
          )}
        </Menu>
        <Menu
          className={styles['logout-menu']}
          mode="inline"
          selectedKeys={isLogoutModalOpen ? ['logout'] : []}
        >
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            danger
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};

Navbar.propTypes = {
  isAdmin: PropTypes.bool,
};

Navbar.defaultProps = {
  isAdmin: false,
};

export default Navbar;
