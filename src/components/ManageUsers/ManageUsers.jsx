import React, { useState, useEffect } from 'react';
import { Table, Space, Button } from 'antd';
import EditUserModal from './EditUserModal/EditUserModal';
import AddUserModal from './AddUserModal/AddUserModal';
import DeleteUserModal from './DeleteUserModal/DeleteUserModal';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';

import styles from './ManageUsers.module.css';
import { GSPBackend } from '../../utils/utils';

const { Column } = Table;

const ManageUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [idToEditOrDelete, setIdToEditOrDelete] = useState('');
  const [users, setUsers] = useState([]);
  const getUsersFromDB = async () => {
    const res = (await GSPBackend.get('/users')).data.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }));
    return res;
  };

  const deleteUser = async userId => {
    try {
      await GSPBackend.delete(`/users/${userId}`);
      const usersFromDB = await getUsersFromDB();
      setUsers(usersFromDB);
    } catch (error) {
      // console.log(error);
    }
  };

  const editUserLabelClicked = id => {
    setIdToEditOrDelete(id);
    setIsEditUserModalOpen(true);
  };

  const deleteUserLabelClicked = id => {
    setIdToEditOrDelete(id);
    setIsDeleteUserModalOpen(true);
  };

  const fetchUsersFromDB = async () => {
    const usersFromDB = await getUsersFromDB();
    setUsers(usersFromDB);
  };

  useEffect(() => {
    document.title = 'Manage Users';
    const fetchUsers = async () => {
      await fetchUsersFromDB();
      setIsLoading(false);
    };
    fetchUsers();
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <EditUserModal
        isOpen={isEditUserModalOpen}
        setIsOpen={setIsEditUserModalOpen}
        id={idToEditOrDelete}
        fetchUsersFromDB={fetchUsersFromDB}
        // onFinish={() => {
        //   Notification();
        // }}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
        fetchUsersFromDB={fetchUsersFromDB}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        setIsOpen={setIsDeleteUserModalOpen}
        deleteUser={deleteUser}
        id={idToEditOrDelete}
        fetchUsersFromDB={fetchUsersFromDB}
      />
      {/* <Notification /> */}
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
                  <a
                    href="#"
                    onClick={() => deleteUserLabelClicked(record.id)}
                    className={styles.deleteLink}
                  >
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
