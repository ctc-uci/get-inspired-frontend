import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
// import CollapsePanel from 'antd/es/collapse/CollapsePanel';

import styles from './AttributeGroup.module.css';

// ONLY used to overwrite default Antd styles
import './AttributeGroup.css';

const AttributeGroup = ({ tableName, columns, checkedLists, setCheckedLists }) => {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onCheckAllChange = e => {
    setCheckedLists({
      ...checkedLists,
      [tableName]: e.target.checked ? columns : [],
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = list => {
    setCheckedLists({
      ...checkedLists,
      [tableName]: list,
    });
    setIndeterminate(!!list.length && list.length < columns.length);
    setCheckAll(list.length === columns.length);
  };

  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Select All
      </Checkbox>
      <Checkbox.Group
        className={`${styles['checkbox-group']} checkbox-group`}
        value={checkedLists[tableName]}
        options={columns}
        onChange={onChange}
      />
    </>
  );
};

AttributeGroup.propTypes = {
  tableName: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkedLists: PropTypes.shape({}).isRequired,
  setCheckedLists: PropTypes.func.isRequired,
};

export default AttributeGroup;
