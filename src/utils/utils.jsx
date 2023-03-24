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

// toCamel, isArray, and isObject are helper functions
const toCamel = s => {
  if (!s) return s;
  return s.replace(/([-_][a-zA-Z])/g, $1 => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const isISODate = str => {
  try {
    const ISOString = str.toISOString();
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(ISOString)) return false;
    const d = new Date(ISOString);
    return d.toISOString() === ISOString;
  } catch (err) {
    return false;
  }
};

const isArray = a => {
  return Array.isArray(a);
};

const isObject = o => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function' && !isISODate(o);
};

// Database columns are in snake case. JavaScript is suppose to be in camel case
// This function converts the keys from the sql query to camel case so it follows JavaScript conventions
const keysToCamel = data => {
  if (isObject(data)) {
    const newData = {};
    Object.keys(data).forEach(key => {
      newData[toCamel(key)] = keysToCamel(data[key]);
    });
    return newData;
  }
  if (isArray(data)) {
    return data.map(i => {
      return keysToCamel(i);
    });
  }
  if (
    typeof data === 'string' &&
    data.length > 0 &&
    data[0] === '{' &&
    data[data.length - 1] === '}'
  ) {
    let parsedList = data.replaceAll('"', '');
    parsedList = parsedList.slice(1, parsedList.length - 1).split(',');
    return parsedList;
  }
  return data;
};
const NotiMessage = {
  COLUMN_ADDED: (column, table) => `Column '${column}' added to the ${table.toLowerCase()} table!`,
  COLUMN_EDITED: (oldColumnName, newColumnName, table) =>
    `Renamed '${oldColumnName}' to '${newColumnName}' in the ${table.toLowerCase()} table!`,
  COLUMN_DELETED: (column, table) =>
    `Column ${column} deleted from the ${table.toLowerCase()} table!`,
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
export { GSPBackend, NotiMessage, NotiIcon, notify, keysToCamel, toCamel };