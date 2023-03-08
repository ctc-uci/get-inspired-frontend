/* eslint-disable react/jsx-props-no-spreading */
import { React, useState, useCallback } from 'react';
import { Row, Col, Upload, Button, Alert, Table, message } from 'antd';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';
import { clamsTableData, clamsTableCols, rakerTableData, rakerTableCols } from './CSVTableData';

function ImportCSV({ incrStep, decrStep, typeOfData }) {
  const { Dragger } = Upload;
  const [csvData, setCSVData] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showImportButton, setShowImportButton] = useState(true);
  const [showCSVTable, setShowCSVTable] = useState(false);

  const handleImportClick = useCallback(() => {
    setShowCSVTable(true);
    setShowImportButton(false);
  });

  // function checkFileValid() {
  //   let isValid = false;
  //   console.log('checkFileValid Called');
  //   const dataLine = csvData.split(' ');
  //   const firstLine = dataLine[0].split(',');
  //   console.log(firstLine);

  //   return isValid;
  // }

  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info);
        const reader = new FileReader();
        reader.onload = e => {
          setCSVData(e.target.result);
        };
        reader.readAsText(info.file.originFileObj);
        // if (!checkFileValid()) {
        //   info.file.status === 'error';
        // }
      }
      if (info.file.status === 'done') {
        message.info('File uploaded successfully!');
        setUploadSuccess(true);
      } else if (info.file.status === 'error') {
        message.info('Error, please try again!');
        setUploadSuccess(false);
      }
    },
  };

  console.log(csvData);

  return (
    <div className="add-data-div">
      {uploadSuccess && showCSVTable && (
        <Alert
          style={{
            textAlign: 'left',
            marginTop: '1.5%',
            marginBottom: '3%',
            width: '40%',
            left: '30%',
          }}
          message="Successfully uploaded CSV Data!"
          type="success"
          closable
        />
      )}
      {/* {!uploadSuccess && (
        <Alert
          style={{
            textAlign: 'left',
            marginBottom: '2%',
            width: '40%',
            left: '30%',
          }}
          message="Error, please try again!"
          type="error"
          closable
        />
      )} */}
      {!showCSVTable && <p style={{ fontWeight: '600' }}>Import CSV to add {typeOfData} data</p>}
      {!showCSVTable && (
        <Dragger
          style={{
            left: '25%',
            padding: '0 2% 2% 2%',
            width: '50%',
            margin: '3% 0 5% 0',
          }}
          {...uploadProps}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            <b>Click to import CSV file</b>
          </p>
          <p style={{ marginTop: '-5px' }} className="ant-upload-hint">
            or drag and drop here
          </p>
          <Button type="primary">Upload File</Button>
        </Dragger>
      )}

      {showCSVTable && typeOfData === 'Clams' && (
        <Table
          style={{ marginTop: '2%' }}
          dataSource={clamsTableData}
          columns={clamsTableCols}
          pagination={{ pageSize: 6 }}
        />
      )}
      {showCSVTable && typeOfData === 'Raker' && (
        <Table
          style={{ marginTop: '2%' }}
          dataSource={rakerTableData}
          columns={rakerTableCols}
          pagination={{ pageSize: 6 }}
        />
      )}

      <Row gutter={16} id="back-next-buttons">
        <Col span={12}>
          <Button type="primary" style={{ background: 'gray' }} onClick={decrStep}>
            Back
          </Button>
        </Col>
        <Col span={12}>
          {showImportButton && (
            <Button type="primary" onClick={handleImportClick}>
              Import
            </Button>
          )}
          {!showImportButton && (
            <Button type="primary" onClick={incrStep}>
              Next
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}

ImportCSV.defaultProps = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
  typeOfData: PropTypes.string,
};

ImportCSV.propTypes = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
  typeOfData: PropTypes.string,
};

export default ImportCSV;
