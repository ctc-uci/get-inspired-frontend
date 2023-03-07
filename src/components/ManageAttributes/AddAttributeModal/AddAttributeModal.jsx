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

  const handleCancel = () => {
    setIsOpen(false);
  };

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
    }
  };

  return (
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
            name="dataType"
            rules={[
              {
                required: true,
                message: 'Please select data type!',
              },
            ]}
          >
            <Select placeholder="Select Data Type">
              <Option value="text">Text</Option>
              <Option value="numeric">Numeric</Option>
              <Option value="Boolean">Boolean</Option>
              <Option value="datetime">Datetime</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <p>{errorMessage}</p>
            <Button type="primary" htmlType="submit">
              + Add Attribute
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

AddAttributeModal.propTypes = {
  isOpen: PropType.bool.isRequired,
  setIsOpen: PropType.func.isRequired,
  tableName: PropType.string.isRequired,
  getTableColsFromDB: PropType.func.isRequired,
};

export default withCookies(AddAttributeModal);
