/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs } from 'antd';
import AttributeGroup from './AttributeGroup/AttributeGroup';

const SelectAttributesModal = ({
  tableState,
  isOpen,
  setIsOpen,
  checkedLists,
  setCheckedLists,
}) => {
  const { tableNames, columnInfo } = tableState;

  const onOk = () => {
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const items = columnInfo.map((columns, index) => {
    const tableName = tableNames.at(index);
    const formattedTableName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    return {
      key: formattedTableName,
      label: `${formattedTableName} table`,
      children: (
        <AttributeGroup
          key={tableName}
          tableName={tableName}
          columns={columns.map(column => column.COLUMN_NAME)}
          checkedLists={checkedLists}
          setCheckedLists={setCheckedLists}
        />
      ),
    };
  });

  return (
    <Modal
      title="Select columns to display"
      open={isOpen}
      onOk={onOk}
      okText="Display Selected"
      onCancel={onCancel}
    >
      <Tabs items={items} />
    </Modal>
  );
};

SelectAttributesModal.propTypes = {
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
  checkedLists: PropTypes.shape({
    tableNames: PropTypes.arrayOf(PropTypes.string),
    columnInfo: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  setCheckedLists: PropTypes.func.isRequired,
};

export default SelectAttributesModal;
