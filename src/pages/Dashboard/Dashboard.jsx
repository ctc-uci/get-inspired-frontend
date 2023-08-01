/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Button, Modal, theme, Typography } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import LoadingScreen from '../../common/LoadingScreen/LoadingScreen';
import { GSPBackend, getUTCDateString, humanizeCell } from '../../utils/utils';

import styles from './Dashboard.module.css';
import './Dashboard.css';

const { Panel } = Collapse;
const { Title } = Typography;

// Rows under each beach group, Each Row is a Survey
const Row = props => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.panelRow} onClick={showModal}>
        <div>
          <span>{props.Location}</span>
          <span id={styles.gray}>{getUTCDateString(props.Date, true)}</span>
        </div>
        <span>Total Clams: {props['# clams found']}</span>
      </div>

      {/* PREVIEW OVERLAY MODAL */}
      <Modal
        centered
        open={open}
        title={
          <div className={styles.modalTitle}>
            <div>
              <b>
                {props.Beach} / {props.Location}
              </b>
              <span>{getUTCDateString(props.Date)}</span>
            </div>
            <span>{`Total Clams: ${props['# clams found']}`}</span>
          </div>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Link
            to="/manage-data"
            state={{ surveyId: props.survey_id, year: `${new Date(props.Date).getUTCFullYear()}` }}
          >
            <Button key="submit" type="primary" onClick={handleOk}>
              View More Details
            </Button>
          </Link>,
        ]}
      >
        <div className={styles.summary}>
          <h3>Summary</h3>
          <div className={styles.summaryCards}>
            {/* Hard Coded Summary Card Info for unique measurements */}
            <div className={styles.summaryCard}>
              <div>
                <b>{props['# people']}</b>
                <span></span>
              </div>
              <p>People</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['# clams found']}</b>
                <span></span>
              </div>
              <p>Clams Found</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['# man hours']}</b>
                <span></span>
              </div>
              <p>Hours Worked</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['distance covered']}</b>
                <span>m</span>
              </div>
              <p>Distance Raked</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['clams/man hr']}</b>
                <span>m</span>
              </div>
              <p>Clams/Man hour</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['clam density']}</b>
                <span>m</span>
              </div>
              <p>Clam Density</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['avg length']}</b>
                <span>mm</span>
              </div>
              <p>Avg Length</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['avg width']}</b>
                <span>mm</span>
              </div>
              <p>Avg Width</p>
            </div>

            <div className={styles.summaryCard}>
              <div>
                <b>{props['avg weight']}</b>
                <span>mm</span>
              </div>
              <p>Avg Weight</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Dashboard = () => {
  // Getting Survey Data from database
  const [isLoading, setIsLoading] = useState(true);
  const [beaches, setBeaches] = useState([]);
  const getSurveyOptions = async () => {
    const res = (await GSPBackend.get('/surveys/dashboardSurveyOptions')).data;
    return Object.keys(res).map(key => ({ beach: key, surveys: res[key] }));
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
    document.title = 'Get Inspired';
    await fetchBeachesFromDB();
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className={styles.container}>
      <Title>Dashboard</Title>
      <Title level={5}>
        The surveys displayed are only from the current season. To view surveys from past seasons,
        query data.
      </Title>
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
                <span>{`Total Clams: ${beachOptions.surveys.reduce(
                  (acc, curr) => acc + curr['# clams found'],
                  0,
                )}`}</span>
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
