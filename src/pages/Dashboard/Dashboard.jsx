/* eslint-disable */
import { useState } from 'react';
import { Collapse, Button, Modal, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './Dashboard.module.css';
import './Dashboard.css';

const { Panel } = Collapse;

// Headers to Categorize Surveys by Beaches
function Header() {
  return (
    <div className={styles.panelHeader}>
      <span>{`Total Clams: 3242`}</span>
      <span>
        <b>{`Beach Name`}</b>
      </span>
    </div>
  );
}

// Title for each survey's Preview Overlay (aka Quick Calculations Preview)
function ModalTitle() {
  return (
    <div className={styles.modalTitle}>
      <div>
        <b>{`Beach Name / Zone X`}</b>
        <span>11/22/2023</span>
      </div>
      <span>{`Total Clams: 3242`}</span>
    </div>
  );
}

// Rows under each beach or "Header", Each Row is a Survey
function Row() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.panelRow} onClick={showModal}>
        <div>
          <span>
            {/* REPLACE THIS PLACEHOLDER IMG */}
            <img
              src="https://avr.london/wp-content/uploads/2014/10/Placeholder_Square.png"
              alt="Placeholder owo"
            />
            <span>Zone X</span>
          </span>
          <span>04/20/2069</span>
        </div>

        <span>Total Clams: 101</span>
      </div>

      {/* PREVIEW OVERLAY MODAL */}
      <Modal
        centered
        open={open}
        title={<ModalTitle />}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            View More Details
          </Button>,
        ]}
      >
        <div className={styles.summary}>
          <h3>Summary</h3>
          <div className={styles.summaryCards}>
            {/* Map The Calculations on the SummaryCard. Can be Found down below */}
            <SummaryCard />
            <SummaryCard />
            <SummaryCard />
            <SummaryCard />
            <SummaryCard />
            <SummaryCard />
            <SummaryCard />
          </div>
        </div>
      </Modal>
    </>
  );
}

// Calcuations/Summary Card displayed on the Quick Preview Modal (can map with props)
function SummaryCard() {
  return (
    <div className={styles.summaryCard}>
      <div>
        <b>30</b>
        <span>mm</span>
      </div>
      <p>People</p>
    </div>
  );
}

function BeachPanel() {
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };
  return (
    <>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{
          background: token.colorBgContainer,
        }}
      >
        <Panel key="1" header={<Header />} style={panelStyle}>
          {/* Map Data in Row */}
          <Row />
          <Row />
          <Row />
        </Panel>
      </Collapse>
    </>
  );
}

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <p>
        The surveys displayed are only from the current season. To view surveys from past seasons,
        query data.
      </p>
      {/* Map Survey Beaches here */}
      <BeachPanel />
      <BeachPanel />
    </div>
  );
};

export default Dashboard;
