import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

// See auth_utils for AuthInterceptor
const GSPBackend = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_BACKEND_HOST
      : process.env.REACT_APP_BACKEND_HOST_PROD,
  withCredentials: true,
});

const NotiMessage = {
  USER_DELETED: 'User deleted!',
  USER_ADDED: 'User added!',
  USER_EDITED: 'User edits saved!',
};

const NotiIcon = {
  SUCCESS: <CheckCircleOutlined style={{ color: 'green' }} />,
};
const notify = (message, icon) => {
  notification.open({
    message,
    icon,
  });
};

// eslint-disable-next-line import/prefer-default-export
export { GSPBackend, NotiMessage, NotiIcon, notify };
