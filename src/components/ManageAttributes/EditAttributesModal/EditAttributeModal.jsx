import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { withCookies } from '../../../utils/cookie_utils';

import styles from './EditAttributeModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const EditAttributeModal = ({ isOpen, setIsOpen, name, getTableColsFromDB }) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState();

  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(async () => {
    if (name) {
      const attribute = GSPBackend.get(`/tables/${name}/columns`).data.map(id => ({
        ...id,
        attributeName: id.COLUMN_NAME,
      }));
      form.setFieldsValue({
        attributeName: attribute.name,
      });
    }
  }, [name]);

  // this obviously will not work
  const handleSubmit = async values => {
    try {
      const { role, firstName, lastName } = values;

      await GSPBackend.put(`/users/${name}`, {
        role,
        firstName,
        lastName,
      });
      await getTableColsFromDB();
      handleOk();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Modal open={isOpen} okText="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <div className={styles.container}>
          <h1>Edit Attribute</h1>
          <Form
            id="edit-attribute-form"
            layout="vertical"
            name="login-form"
            form={form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Attribute Name"
              name="attributeName"
              rules={[
                {
                  required: true,
                  message: 'Please input a name for your attribute!',
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>
          </Form>
          <p>{errorMessage}</p>
          <Button type="primary" form="edit-user-form" key="submit" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

EditAttributeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  getTableColsFromDB: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default withCookies(EditAttributeModal);
