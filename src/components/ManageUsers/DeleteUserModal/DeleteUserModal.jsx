import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

import { NotiMessage, NotiIcon, notify } from '../../../utils/utils';
import { withCookies } from '../../../utils/cookie_utils';

const DeleteUsersModal = ({ isOpen, setIsOpen, deleteUser, id, fetchUsersFromDB }) => {
  const handleOk = async () => {
    // Delete user function here
    await deleteUser(id);
    await fetchUsersFromDB();
    notify(NotiMessage.USER_DELETED, NotiIcon.SUCCESS);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Confirm Delete"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleOk}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this user?</p>
    </Modal>
  );
};

DeleteUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchUsersFromDB: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default withCookies(DeleteUsersModal);
