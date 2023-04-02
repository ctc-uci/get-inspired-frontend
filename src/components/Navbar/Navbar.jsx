import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import {
  HomeOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

import { getCurrentUser, auth } from '../../utils/auth_utils';
import { GSPBackend } from '../../utils/utils';

import GSPLogo from '../../assets/images/GSPLogo.svg';

// eslint-disable-next-line import/no-unresolved
import styles from './Navbar.module.css';

const SIDER_WIDTH = 200;
const auth1 = auth;

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth1) {
        const user = await getCurrentUser(auth1);
        if (user) {
          const response = await GSPBackend.get(`/users/${user.uid}`);
          setCurrentUser(response.data);
        }
      }
    };
    fetchUser();
  }, [auth]);

  const selectedKeys = [
    ...(path === '/' ? ['dashboard'] : []),
    ...(path === '/manage-columns' ? ['manage-columns'] : []),
    ...(path === '/add-data' ? ['add-data'] : []),
    ...(path === '/query-data' ? ['query-data'] : []),
    ...(path === '/manage-data' ? ['manage-data'] : []),
    ...(path === '/manage-users' ? ['manage-users'] : []),
    ...(path === '/profile' ? ['profile'] : []),
  ];
  return (
    <Sider width={SIDER_WIDTH} className={styles.sider}>
      <div className={styles['logo-wrapper']}>
        <img src={GSPLogo} alt="GSP Logo" className={styles['logo-picture']} />
        <Title className={styles['logo-text']} level={5}>
          Get Inspired
        </Title>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={selectedKeys}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="dashboard" icon={<HomeOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="manage-columns" icon={<DatabaseOutlined />}>
          <Link to="/manage-columns">Manage Columns</Link>
        </Menu.Item>
        <Menu.Item key="add-data" icon={<FileAddOutlined />}>
          <Link to="/add-data">Add Data</Link>
        </Menu.Item>
        <Menu.Item key="manage-data" icon={<AppstoreOutlined />}>
          <Link to="/manage-data">Manage Data</Link>
        </Menu.Item>
        <Menu.Item key="query-data" icon={<SearchOutlined />}>
          <Link to="/query-data">Query Data</Link>
        </Menu.Item>
        <Menu.Item key="manage-users" icon={<UsergroupAddOutlined />}>
          <Link to="/manage-users">Manage Users</Link>
        </Menu.Item>
        <Menu.Item
          key="profile"
          icon={<UsergroupAddOutlined />}
          style={{ position: 'absolute', bottom: '0' }}
        >
          <Link to="/profile">{currentUser ? `${currentUser[0].firstName}` : 'Profile'}</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navbar;
