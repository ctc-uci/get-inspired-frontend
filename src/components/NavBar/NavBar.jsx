import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import {
  ClockCircleFilled,
  HomeFilled,
  SafetyCertificateFilled,
  DatabaseFilled,
  BellFilled,
  GlobalOutlined,
} from '@ant-design/icons';

const SIDER_WIDTH = 200;

const { Sider } = Layout;

const VerticalMenu = () => {
  return (
    <Sider width={SIDER_WIDTH}>
      <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="global-log" icon={<GlobalOutlined />}>
          GetInspired
        </Menu.Item>
        <Menu.Item key="home-logo" icon={<HomeFilled />}>
          <Link to="/Dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="database-logo" icon={<DatabaseFilled />}>
          <Link to="/Data">View Data</Link>
        </Menu.Item>
        <Menu.Item key="certificate-logo" icon={<SafetyCertificateFilled />}>
          <Link to="/Data/Add">Add Data</Link>
        </Menu.Item>
        <Menu.Item key="clock-logo" icon={<ClockCircleFilled />}>
          Query Data
        </Menu.Item>
        <Menu.Item key="bell-logo" icon={<BellFilled />}>
          Notifications
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default VerticalMenu;
