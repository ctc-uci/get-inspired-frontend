/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Collapse } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
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
    // TODO: FETCH QUERY RESULTS
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Display Attributes"
      open={isOpen}
      onOk={onOk}
      okText="Display Selected"
      onCancel={onCancel}
    >
      <Collapse>
        {columnInfo.map((columns, index) => {
          return (
            <CollapsePanel key={tableNames.at(index)} header={tableNames.at(index)}>
              <AttributeGroup
                key={tableNames.at(index)}
                tableName={tableNames.at(index)}
                columns={columns.map(column => column.COLUMN_NAME)}
                checkedLists={checkedLists}
                setCheckedLists={setCheckedLists}
              />
            </CollapsePanel>
          );
        })}
      </Collapse>
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
