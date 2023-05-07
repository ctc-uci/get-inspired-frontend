import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Typography, Button } from 'antd';

import { logout, useNavigate } from '../../../utils/auth_utils';
import { withCookies, Cookies } from '../../../utils/cookie_utils';

import styles from './LogoutModal.module.css';

const { Title } = Typography;

const LogoutModal = ({ isOpen, setIsOpen, cookies }) => {
  const navigate = useNavigate();
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk} footer={[]}>
      <div className={styles.container}>
        <Title level={3}>Are you sure you want to log out?</Title>
        <div className={styles.buttons}>
          <Button onClick={() => logout('/login', navigate, cookies)}>Yes</Button>
          <Button type="primary" onClick={handleCancel}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

LogoutModal.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default withCookies(LogoutModal);
