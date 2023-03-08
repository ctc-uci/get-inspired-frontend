import React from 'react';
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

import GSPLogo from '../../assets/images/GSPLogo.svg';

// eslint-disable-next-line import/no-unresolved
import styles from './Navbar.module.css';

const SIDER_WIDTH = 200;

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const selectedKeys = [
    ...(path === '/' ? ['dashboard'] : []),
    ...(path === '/manage-attributes' ? ['manage-attributes'] : []),
    ...(path === '/add-data' ? ['add-data'] : []),
    ...(path === '/query-data' ? ['query-data'] : []),
    ...(path === '/manage-data' ? ['manage-data'] : []),
    ...(path === '/manage-users' ? ['manage-users'] : []),
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
        <Menu.Item key="manage-attributes" icon={<DatabaseOutlined />}>
          <Link to="/manage-attributes">Manage Attributes</Link>
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
      </Menu>
    </Sider>
  );
};

export default Navbar;
