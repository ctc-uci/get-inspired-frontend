/* eslint-disable */
import { useState, useEffect } from 'react';
import { Collapse, Button, Modal, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { GSPBackend } from '../../utils/utils';

import styles from './Dashboard.module.css';
import './Dashboard.css';

const { Panel } = Collapse;

// Rows under each beach group, Each Row is a Survey
function Row(props) {
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
          {/* REPLACE THIS PLACEHOLDER IMG */}
          <img
            src="https://avr.london/wp-content/uploads/2014/10/Placeholder_Square.png"
            alt="Placeholder owo"
          />
          <span>{props.location}</span>
          <span>
            <gray>{props.date}</gray>
          </span>
        </div>
        <span>Total Clams: N/A</span>
      </div>

      {/* PREVIEW OVERLAY MODAL */}
      <Modal
        centered
        open={open}
        title={
          <div className={styles.modalTitle}>
            <div>
              <b>
                {props.beach} / {props.location}
              </b>
              <span>{props.date}</span>
            </div>
            <span>{`Total Clams: NaN`}</span>
          </div>
        }
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
            {/* Hard Coded Summary Card Info for unique measurements */}
            <div className={styles.summaryCard}>
              <div>
                <b>{props.start_time}</b>
                <span></span>
              </div>
              <p>Start Time</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props.water_depth}</b>
                <span>m</span>
              </div>
              <p>Water Depth</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props.duration}</b>
                <span>min</span>
              </div>
              <p>duration</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props.distance}</b>
                <span>m</span>
              </div>
              <p>distance</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props.string}</b>
                <span></span>
              </div>
              <p>string</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

const Dashboard = () => {
  // Getting Survey Data from database
  const [isLoading, setIsLoading] = useState(true);
  const [beaches, setBeaches] = useState([]);
  const getSurveyOptions = async () => {
    const res = (await GSPBackend.get('/surveys/dashboardSurveyOptions')).data;
    const keys = Object.keys(res);
    const values = Object.values(res);
    const result = keys.map((key, index) => ({ beach: key, surveys: values[index] }));
    // result is {beach: <beachname>, surveys: [{},{}]}
    return result;
  };
  const fetchBeachesFromDB = async () => {
    const beachesFromDB = await getSurveyOptions();
    setBeaches(beachesFromDB);
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  useEffect(async () => {
    await fetchBeachesFromDB();
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.container}>
      <h2>Dashboard</h2>
      <p>
        The surveys displayed are only from the current season. To view surveys from past seasons,
        query data.
      </p>
      <Collapse
        accordion
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{
          background: token.colorBgContainer,
        }}
      >
        {beaches.map((beachOptions, index) => (
          <Panel
            key={index}
            header={
              <div className={styles.panelHeader}>
                <span>{`Total Clams: NaN`}</span>
                <span>
                  <b>{beachOptions.beach}</b>
                </span>
              </div>
            }
            style={panelStyle}
          >
            {beachOptions.surveys.map((items, index) => (
              <Row {...items} key={index} />
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default Dashboard;
