import React, { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';
import EditUserModal from './EditUserModal/EditUserModal';
import AddUserModal from './AddUserModal/AddUserModal';
import getUsersFromDB from '../../utils/users_utils';

import styles from './ManageUsers.module.css';
import { GSPBackend } from '../../utils/utils';

const { Column } = Table;

const ManageUsers = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [users, setUsers] = useState([]);
  const deleteUser = async userId => {
    try {
      await GSPBackend.delete(`/users/${userId}`);
      const usersFromDB = await getUsersFromDB();
      setUsers(usersFromDB);
    } catch (error) {
      // handle error, e.g. display an error message
    }
  };

  const editUserLabelClicked = id => {
    setIdToEdit(id);
    setIsEditUserModalOpen(true);
  };

  const fetchUsersFromDB = async () => {
    const usersFromDB = await getUsersFromDB();
    setUsers(usersFromDB);
  };

  useEffect(() => {
    fetchUsersFromDB();
  }, []);
  return (
    <>
      <EditUserModal
        isOpen={isEditUserModalOpen}
        setIsOpen={setIsEditUserModalOpen}
        id={idToEdit}
        fetchUsersFromDB={fetchUsersFromDB}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
        fetchUsersFromDB={fetchUsersFromDB}
      />
      <div className={styles['header-title']}>
        <h1>Manage Users</h1>
        <Button type="primary" onClick={() => setIsAddUserModalOpen(true)}>
          Add User
        </Button>
      </div>
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
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={() => editUserLabelClicked(record.id)}>
                    Edit
                  </a>
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

export default ManageUsers;
