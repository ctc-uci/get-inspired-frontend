/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Collapse } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import { GSPBackend } from '../../../utils/auth_utils';
import AttributeGroup from './AttributeGroup/AttributeGroup';

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof defaultInit === 'function' ? new defaultInit().valueOf() : defaultInit),
      },
    );
  }
}

const SelectAttributesModal = ({ isOpen, setIsOpen }) => {
  const [state, setState] = useState({
    tableNames: [],
    columnInfo: [],
  });
  const [checkedLists, setCheckedLists] = useState(new DefaultDict(Array));

  const onOk = () => {
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  useEffect(async () => {
    if (isOpen) {
      const response = await GSPBackend.get('/tables');
      const tableNames = response.data.map(tableInformation => tableInformation.TABLE_NAME);
      const columnInfoRequests = tableNames.map(tableName =>
        GSPBackend.get(`/tables/${tableName}/columns`),
      );
      const columnInfo = (await Promise.all(columnInfoRequests)).map(
        columnInfoResponse => columnInfoResponse.data,
      );
      setState({ tableNames, columnInfo });
    }
  }, [isOpen]);

  return (
    <Modal title="Select Attributes" open={isOpen} onOk={onOk} onCancel={onCancel}>
      <Collapse>
        {state.columnInfo.map((columns, index) => {
          return (
            <CollapsePanel key={state.tableNames.at(index)} header={state.tableNames.at(index)}>
              <AttributeGroup
                key={state.tableNames.at(index)}
                tableName={state.tableNames.at(index)}
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
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default SelectAttributesModal;
