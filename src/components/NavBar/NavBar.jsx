import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import {
  ClockCircleFilled,
  HomeFilled,
  SafetyCertificateFilled,
  DatabaseFilled,
  BellFilled,
} from '@ant-design/icons';

import { ReactComponent as GSPLogo } from '../../assets/GSPLogo.svg';

const SIDER_WIDTH = 200;

const { Sider } = Layout;

const VerticalMenu = () => {
  const location = useLocation();
  const path = location.pathname;

  const selectedKeys = [
    ...(path === '/data' ? ['database-logo'] : []),
    ...(path === '/' ? ['certificate-logo'] : []),
    ...(path === '/Dashboard' ? ['home-logo'] : []),
    ...(path === '/data' ? ['clock-logo'] : []),
  ];
  return (
    <Sider width={SIDER_WIDTH} collapsible>
      <Menu
        mode="inline"
        defaultSelectedKeys={selectedKeys}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="global-log" icon={<GSPLogo />}>
          GetInspired
        </Menu.Item>
        <Menu.Item key="home-logo" icon={<HomeFilled />}>
          <Link to="/Dashboard">Overview</Link>
        </Menu.Item>
        <Menu.Item key="database-logo" icon={<DatabaseFilled />}>
          <Link to="/Data">Manage Attributes</Link>
        </Menu.Item>
        <Menu.Item key="certificate-logo" icon={<SafetyCertificateFilled />}>
          <Link to="/AddData">Add Data</Link>
        </Menu.Item>
        <Menu.Item key="clock-logo" icon={<ClockCircleFilled />}>
          <Link to="/Data">Manage Data</Link>
        </Menu.Item>
        <Menu.Item key="bell-logo" icon={<BellFilled />}>
          Notifications
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default VerticalMenu;
