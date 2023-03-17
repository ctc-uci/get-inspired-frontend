import React, { useState, useEffect } from 'react';
import { Table, Space, Button, notification } from 'antd';
import EditUserModal from './EditUserModal/EditUserModal';
import AddUserModal from './AddUserModal/AddUserModal';
import DeleteUserModal from './DeleteUserModal/DeleteUserModal';

import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from '../../utils/utils';

import styles from './ManageUsers.module.css';

const { Column } = Table;

const ManageUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

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
      console.log('what the hell');
    }
  };

  const editUserLabelClicked = id => {
    setIdToEdit(id);
    setIsEditUserModalOpen(true);
  };

  const deleteUserLabelClicked = user => {
    console.log('AsdfasD');
    setUserToDelete(user);
    console.log(user);
    setIsDeleteUserModalOpen(true);
  };

  const fetchUsersFromDB = async () => {
    const usersFromDB = await getUsersFromDB();
    setUsers(usersFromDB);
  };

  const close = () => {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
  };
  const Notification = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
      const key = `open${Date.now()}`;
      const btn = (
        <Space>
          <Button type="primary" size="small" onClick={() => api.destroy()}>
            Cancel
          </Button>
          <Button type="primary" size="small" onClick={() => api.destroy(key)}>
            Confirm
          </Button>
        </Space>
      );
      api.open({
        message: 'Notification Title',
        description:
          'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
        btn,
        key,
        onCLose: close,
      });
    };
    return (
      <>
        {contextHolder}
        <Button type="primary" onClick={openNotification}>
          Open the notification box
        </Button>
      </>
    );
  };

  useEffect(() => {
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
        id={idToEdit}
        fetchUsersFromDB={fetchUsersFromDB}
        onFinish={() => {
          Notification();
        }}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        setIsOpen={setIsAddUserModalOpen}
        fetchUsersFromDB={fetchUsersFromDB}
      />
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        setIsOpen={setIsDeleteUserModalOpen}
        onOk={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
            // notification for deleting successfully//
          }
        }}
        onCancel={() => {
          setUserToDelete(null);
          setIsDeleteUserModalOpen(false);
        }}
      />
      <Notification />
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
                    onClick={() => deleteUserLabelClicked(record)}
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
