import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { withCookies } from '../../../utils/cookie_utils';

const DeleteUsersModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    // Delete user function here
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Delete User
      </Button>
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
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
    </>
  );
};

export default withCookies(DeleteUsersModal);
