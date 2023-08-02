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
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuthContext } from '../../common/AuthContext';
import LogoutModal from './LogoutModal/LogoutModal';

import GSPLogo from '../../assets/images/GSPLogo.svg';

import styles from './Navbar.module.css';

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

const Navbar = ({ hasLoaded, isAdmin }) => {
  const location = useLocation();
  const path = location.pathname;

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(PATH_TO_KEYS[path]);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    setSelectedKeys(PATH_TO_KEYS[path]);
  }, [location]);

  return (
    hasLoaded && (
      <Sider className={styles.sider} theme="light">
        <LogoutModal isOpen={isLogoutModalOpen} setIsOpen={setIsLogoutModalOpen} />
        <div className={styles['sider-wrapper']}>
          <div className={styles['logo-wrapper']}>
            <img src={GSPLogo} alt="GSP Logo" className={styles['logo-picture']} />
            <Title className={styles['logo-text']} level={5}>
              Get Inspired
            </Title>
          </div>
          <Menu
            mode="vertical"
            selectedKeys={selectedKeys}
            style={{ height: '100%', borderRight: 0 }}
          >
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
            className={styles['profile-menu']}
            mode="vertical"
            theme="light"
            selectable="false"
            selectedKeys={isLogoutModalOpen ? ['profile-submenu'] : []}
          >
            <Menu.SubMenu
              icon={<UserOutlined />}
              title={`${currentUser.firstName} ${currentUser.lastName}`}
              key="profile-submenu"
              className={styles['profile-submenu']}
            >
              {isAdmin && (
                <Menu.Item icon={<LockOutlined />} key="reset-password">
                  <Link to="manage-users" state={{ userIdToEdit: currentUser.id }}>
                    Reset Password
                  </Link>
                </Menu.Item>
              )}
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                danger
                onClick={() => setIsLogoutModalOpen(true)}
              >
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </Sider>
    )
  );
};

Navbar.propTypes = {
  hasLoaded: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

Navbar.defaultProps = {
  hasLoaded: false,
  isAdmin: false,
};

export default Navbar;
