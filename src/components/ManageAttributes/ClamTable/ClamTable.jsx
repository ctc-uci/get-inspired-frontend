import React, { useState, useEffect } from 'react';
import { Space, Table, Button } from 'antd';

import { GSPBackend } from '../../utils/utils';

const ClamTable = () => {
  const [clams, setClams] = useState([]);

  // Clams
  // const getClamsColsFromDB = async () => {
  //   const res = (await GSPBackend.get('/tables/clam/columns')).data.map(id => ({
  //     ...id,
  //     attributeName: id.COLUMN_NAME,
  //     dataType: adjustDataType(id.DATA_TYPE),
  //   }));
  //   return res;
  // };

  // const getAllClams = async () => {
  //   const clamCols = await getClamsColsFromDB();
  //   setClams(clamCols);
  // };

  // useEffect(() => {
  //   getAllClams();
  // }, []);
};

export default ClamTable;
