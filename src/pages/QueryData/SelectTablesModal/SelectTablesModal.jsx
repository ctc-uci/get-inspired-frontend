/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Checkbox } from 'antd';

import styles from './SelectTablesModal.module.css';
import './SelectTablesModal.css';

const SelectTablesModal = ({ tableState, isOpen, setIsOpen, setCheckedTables }) => {
  const { tableNames } = tableState;

  const onOk = () => {
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const onChange = list => {
    setCheckedTables(list);
  };

  const options = tableNames.map(tableName => {
    const formattedTableName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    return {
      label: formattedTableName,
      value: tableName,
    };
  });

  return (
    <Modal
      title="Select Tables to Search"
      open={isOpen}
      onOk={onOk}
      okText="Select Tables"
      onCancel={onCancel}
    >
      <Checkbox.Group
        className={`${styles['checkbox-group']} checkbox-group`}
        options={options}
        onChange={onChange}
      />
    </Modal>
  );
};

SelectTablesModal.propTypes = {
  tableState: PropTypes.shape({
    tableNames: PropTypes.arrayOf(PropTypes.string),
    columnInfo: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          COLUMN_NAME: PropTypes.string,
          DATA_TYPE: PropTypes.string,
        }),
      ),
    ),
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setCheckedTables: PropTypes.func.isRequired,
};

export default SelectTablesModal;
