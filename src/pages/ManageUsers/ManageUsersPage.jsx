import React from 'react';
import AddUserModal from '../../components/ManageUsers/AddUserModal/AddUserModal';
import ManageUsers from '../../components/ManageUsers/ManageUsers';

const ManageUsersPage = () => {
  return (
    <>
      <AddUserModal />
      <ManageUsers />
    </>
  );
};

export default ManageUsersPage;
