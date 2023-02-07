import React from 'react';
import { Upload, Button } from 'antd';

const ImportCSV = () => {
  // const handleUpload = ({ file }) => {
  // const reader = new FileReader();

  // reader.onload = e => {
  //   console.log(e.target.result);
  // };
  // reader.readAsText(file);

  // // Prevent upload
  // return false;
  // };

  return (
    <div>
      <h1>Import Csv Pascal</h1>
      {/* <Upload beforeUpload={handleUpload}> */}
      <Upload>
        <Button type="primary">Import</Button>
      </Upload>
    </div>
  );
};

export default ImportCSV;
