import { React } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Row, Col, Button, Collapse, theme, Table } from 'antd';
import PropTypes from 'prop-types';

import { clamsTableData, clamsTableCols, rakerTableData, rakerTableCols } from './CSVTableData';

const { Panel } = Collapse;

function ReviewForm({ incrStep, decrStep }) {
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <div className="review-form">
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 180 : 0} />}
        expandIconPosition="end"
        style={{ background: token.colorBgContainer }}
      >
        <Panel header="Survey" key="1" style={panelStyle}>
          <p>Show review data here</p>
        </Panel>
        <Panel header="Clams" key="2" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={clamsTableData}
            columns={clamsTableCols}
            pagination={{ pageSize: 2 }}
          />
        </Panel>
        <Panel header="Raker" key="3" style={panelStyle}>
          <Table
            className="review-ant-table"
            dataSource={rakerTableData}
            columns={rakerTableCols}
            pagination={{ pageSize: 2 }}
          />
        </Panel>
      </Collapse>

      <Row gutter={16} id="back-next-buttons">
        <Col span={12}>
          <Button type="primary" style={{ background: 'gray' }} onClick={decrStep}>
            Back
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={incrStep}>
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
}

ReviewForm.defaultProps = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
};

ReviewForm.propTypes = {
  incrStep: PropTypes.func,
  decrStep: PropTypes.func,
};

export default ReviewForm;
