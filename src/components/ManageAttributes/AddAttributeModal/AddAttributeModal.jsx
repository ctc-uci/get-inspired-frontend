/* eslint-disable react/jsx-props-no-spreading */

import { Button, Form, Input, Select, Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { withCookies } from '../../../utils/cookie_utils';
import styles from './AddAttributeModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const { Option } = Select;
const AddAttributeModal = ({ isOpen, setIsOpen, tableName }) => {
  const handleOk = () => {
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };

  const adjustDataType = typeString => {
    let adjustString = '';

    if (typeString === 'numeric') {
      adjustString = 'Numeric';
    } else if (typeString === 'datetime') {
      adjustString = 'Datetime';
    } else if (typeString === 'boolean') {
      adjustString = 'BOOL';
    } else {
      adjustString = 'Text';
    }

    return adjustString;
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async values => {
    try {
      const { newAttributeName, dataType } = values;
      await GSPBackend.post(
        `/tables/${`${tableName.toLowerCase()}/${capitalizeFirstLetter(
          newAttributeName,
        )}/${adjustDataType(dataType)}`}`,
        {
          tableName,
          newAttributeName,
          dataType,
        },
      );
      // do i need to get table after with updated info
      handleOk();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <h1>New Attribute Name</h1>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="newAttributeName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <h1>Data Type</h1>
          <Form.Item
            name="dataType"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select a datatype" allowClear>
              <Option value="text">Text</Option>
              <Option value="numeric">Numeric</Option>
              <Option value="boolean">Boolean</Option>
              <Option value="datetime">Datetime</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Attribute
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

AddAttributeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
};

export default withCookies(AddAttributeModal);
