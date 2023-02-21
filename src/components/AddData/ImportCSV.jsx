import { React } from 'react';
import { Row, Col, Upload, Button } from 'antd';
import PropTypes from 'prop-types';

function ImportCSV({ incrStep, decrStep, typeOfData }) {
  const handleUpload = ({ file }) => {
    console.log('inside handle upload');
    const reader = new FileReader();

    reader.onload = e => {
      console.log(e.target.result);
    };
    reader.readAsText(file);
    // Prevent upload
    return false;
  };

  return (
    <div className="survey-form-div">
      <p style={{ fontWeight: '600' }}>Import CSV to add {typeOfData} data</p>
      <Upload accept=".csv" beforeUpload={handleUpload}>
        <Button type="primary">Upload File</Button>
      </Upload>

      <Row gutter={16} id="back-next-buttons">
        <Col span={12}>
          <Button type="primary" style={{ background: 'gray' }} onClick={decrStep}>
            Back
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={incrStep}>
            Import
          </Button>
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
