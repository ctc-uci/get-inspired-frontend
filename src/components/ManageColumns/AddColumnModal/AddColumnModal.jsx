import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Modal, Typography } from 'antd';
import PropTypes from 'prop-types';
import { withCookies } from '../../../utils/cookie_utils';
import styles from './AddColumnModal.module.css';
import { GSPBackend } from '../../../utils/utils';

const { Option } = Select;
const { Title } = Typography;
const AddColumnModal = ({ isOpen, setIsOpen, tableName }) => {
  const [form] = Form.useForm();
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

  const handleSubmit = async values => {
    try {
      const { newAttributeName, dataType } = values;
      await GSPBackend.post(
        `/tables/${`${tableName.toLowerCase()}/${newAttributeName}/${adjustDataType(dataType)}`}`,
        {
          tableName,
          newAttributeName,
          dataType,
        },
      );
      handleOk();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ newAttributeName: '', dataType: '' });
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
      <div className={styles.container}>
        <Title level={3} className={styles.header}>
          New Column Name
        </Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="New Column Name"
            name="newAttributeName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Data Type"
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
          <Button type="primary" htmlType="submit" className={styles['add-column-button']}>
            Add Column
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

AddColumnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
};

export default withCookies(AddColumnModal);
