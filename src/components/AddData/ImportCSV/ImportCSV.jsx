/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Row, Col, Upload, Button, Alert, Table, Checkbox, message } from 'antd';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';

import DeleteDataModal from './DeleteDataModal/DeleteDataModal';
import EditableCell from './EditableCell';
import { GSPBackend } from '../../../utils/utils';

import styles from './ImportCSV.module.css';

const PAGE_SIZE = 8;
const ImportCSV = ({ incrStep, decrStep, typeOfData, csvData, setCsvData }) => {
  const { Dragger } = Upload;
  // eslint-disable-next-line
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [noData, setNoData] = useState(false);

  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);

  const rowSelection = {
    selectedRowKeys,
    onChange: _selectedRowKeys => {
      setSelectedRowKeys(_selectedRowKeys);
    },
  };

  const uploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    async onChange(info) {
      if (info.file.status !== 'uploading') {
        const reader = new FileReader();
        reader.onload = async e => {
          // Change raw CSV data to JSON format
          const result = await GSPBackend.post('/csv/upload', {
            data: e.target.result,
          });
          setCsvData({
            ...csvData,
            [typeOfData]: result.data.map((record, index) => ({ ...record, index })),
          });
          setSelectedRowKeys([]);
          setNoData(false);
        };
        reader.readAsText(info.file.originFileObj);
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

  const computeColumnsFromExisting = columnData => {
    return columnData.map(column => ({
      ...column,
      render: (text, record, index) => (
        <EditableCell
          text={text}
          record={record}
          index={index + (page - 1) * PAGE_SIZE}
          typeOfData={typeOfData}
          columnName={column.title}
          columnType={column.type}
          csvData={csvData}
          setCsvData={setCsvData}
          autoDisabled={false}
        />
      ),
    }));
  };

  const deleteSelectedRows = () => {
    setCsvData({
      ...csvData,
      [typeOfData]: csvData[typeOfData]
        .filter(({ index }) => !selectedRowKeys.includes(index))
        .map((record, index) => ({ ...record, index })),
    });
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    if (csvData[typeOfData].length && csvData[`${typeOfData}Cols`].length) {
      setCsvData({
        ...csvData,
        [`${typeOfData}Cols`]: computeColumnsFromExisting(csvData[`${typeOfData}Cols`]),
      });
    }
  }, [csvData[typeOfData], page]);

  const showCSVTable = csvData[typeOfData].length > 0;

  return (
    <div className={styles.addDataDiv}>
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
      {!showCSVTable && (
        <>
          <p style={{ fontWeight: '600' }}>Import CSV to add {typeOfData} data</p>
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
            <Button type="primary" disabled={noData}>
              Upload File
            </Button>
          </Dragger>
          <Checkbox onClick={e => setNoData(e.target.checked)}>
            There is no {typeOfData} data to upload
          </Checkbox>
        </>
      )}

      {showCSVTable && (
        <>
          <Button
            disabled={!selectedRowKeys.length}
            className={styles['delete-button']}
            type="primary"
            onClick={() => setIsDeleteDataModalOpen(true)}
          >
            Delete selected rows
          </Button>
          <Table
            scroll={{ x: true }}
            rowSelection={rowSelection}
            style={{ marginTop: '2%' }}
            dataSource={[...csvData[typeOfData]]}
            columns={[...csvData[`${typeOfData}Cols`]]}
            pagination={{
              pageSize: PAGE_SIZE,
              current: page,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: setPage,
            }}
            rowKey="index"
          />
          <Button type="primary" onClick={() => setCsvData({ ...csvData, [typeOfData]: [] })}>
            Reupload data
          </Button>
          <DeleteDataModal
            isOpen={isDeleteDataModalOpen}
            setIsOpen={setIsDeleteDataModalOpen}
            selectedRowKeys={selectedRowKeys}
            deleteSelectedRows={deleteSelectedRows}
          />
        </>
      )}

      <Row gutter={16} id="back-next-buttons">
        <Col span={12}>
          <Button type="default" onClick={decrStep}>
            Back
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            onClick={incrStep}
            disabled={(!noData && !csvData[typeOfData].length) || selectedRowKeys.length}
          >
            Next
          </Button>
        </Col>
      </Row>
    </div>
  );
};

ImportCSV.propTypes = {
  incrStep: PropTypes.func.isRequired,
  decrStep: PropTypes.func.isRequired,
  typeOfData: PropTypes.string.isRequired,
  csvData: PropTypes.shape({
    clam: PropTypes.arrayOf(PropTypes.shape({})),
    raker: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  setCsvData: PropTypes.func.isRequired,
};

export default ImportCSV;
