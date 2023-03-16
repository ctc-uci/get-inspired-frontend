<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import PropType from 'prop-types';
import { Button, Modal, Form, Input, Select } from 'antd';
import { withCookies } from '../../../utils/cookie_utils';

// isOpen, getTableColumns from DB (check for duplicates), tableName, setIsOpen
const AddAttributeModal = ({ isOpen, setIsOpen, tableName, getTableColsFromDB }) => {
  const [errorMessage, setErrorMessage] = useState();

  const handleOk = () => {
    setIsOpen(false);
  };

>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
  const handleCancel = () => {
    setIsOpen(false);
  };

<<<<<<< HEAD
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
=======
  const handleSubmit = async values => {
    try {
      const { attributeName, dataType } = values;

      const colData = await getTableColsFromDB(tableName);
      const checkDupAttribute = obj => obj.attributeName === attributeName;

      if (colData.some(checkDupAttribute)) {
        throw new Error('Duplicate Attribute Name');
      }

      // INSERT ADD TO TABLE ROUTE HERE
      handleOk();
    } catch (error) {
      setErrorMessage(error.message);
>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <Modal open={isOpen} okTest="Submit" onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div>
        <h1>Add Attribute</h1>
        <Form id="" layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="New Attribute Name"
            name="attributeName"
            rules={[
              {
                required: true,
                message: 'Please add input attribute name!',
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Data Type"
>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
            name="dataType"
            rules={[
              {
                required: true,
<<<<<<< HEAD
              },
            ]}
          >
            <Select placeholder="Select a datatype" allowClear>
              <Option value="text">Text</Option>
              <Option value="numeric">Numeric</Option>
              <Option value="boolean">Boolean</Option>
=======
                message: 'Please select data type!',
              },
            ]}
          >
            <Select placeholder="Select Data Type">
              <Option value="text">Text</Option>
              <Option value="numeric">Numeric</Option>
              <Option value="Boolean">Boolean</Option>
>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
              <Option value="datetime">Datetime</Option>
            </Select>
          </Form.Item>
          <Form.Item>
<<<<<<< HEAD
            <Button type="primary" htmlType="submit">
              Add Attribute
=======
            <p>{errorMessage}</p>
            <Button type="primary" htmlType="submit">
              + Add Attribute
>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

AddAttributeModal.propTypes = {
<<<<<<< HEAD
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
=======
  isOpen: PropType.bool.isRequired,
  setIsOpen: PropType.func.isRequired,
  tableName: PropType.string.isRequired,
  getTableColsFromDB: PropType.func.isRequired,
>>>>>>> f1afe2a127763a69581ec28c414cd1f7cd9a9864
};

export default withCookies(AddAttributeModal);
