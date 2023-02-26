import React, { useState, useEffect } from 'react';
import { Table, Space } from 'antd';
import ManageUsers from '../../components/ManageUsers/ManageUsers';
import EditUsers from '../../components/EditUsers/EditUsers';
import getUsersFromDB from '../../utils/users_utils';

import styles from './ManageUsersPage.module.css';
import { GSPBackend } from '../../utils/utils';

const { Column } = Table;

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsersFromDB = async () => {
      const usersFromDB = await getUsersFromDB();
      setUsers(usersFromDB);
    };
    fetchUsersFromDB();
  }, []);
  const deleteUser = async userId => {
    try {
      await GSPBackend.delete(`/users/${userId}`);
      // handle success, e.g. display a message or refresh the user list
    } catch (error) {
      // handle error, e.g. display an error message
    }
  };
  return (
    <>
      <ManageUsers />
      <div className={styles.container}>
        <div className={styles.page}>
          <Table size="large" width="10%" dataSource={users} rowKey="id">
            <Column title="Name" dataIndex="fullName" key="name" />
            <Column title="Role" dataIndex="role" key="role" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column
              title="Setting"
              key="setting"
              render={(index, record) => (
                <Space size="middle">
                  <EditUsers record={record} />
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={() => deleteUser(record.id)}>
                    Delete
                  </a>
                </Space>
              )}
            />
          </Table>
        </div>
      </div>
    </>
  );
};

export default ManageUsersPage;
