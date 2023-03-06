import React, { useState, useEffect } from 'react';
import { Collapse, Table, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './Dashboard.module.css';
import { GSPBackend } from '../../utils/utils';
import SummaryTable from './SummaryTable';

/* eslint-disable */

/*
data we need access to:
  - amount of clams per survey
  - survey location
  - survey date
  - num people in survey
  - clams found
  - hours worked
  - miles covered
  - show clams per hour
*/

function CustomHeader({ title, count }) {
  return (
    <div className={styles.panelheader}>
      <span>{title}</span>
      <span className={styles.totalClams}>{`Total Clams: ${count}`}</span>
    </div>
  );
}

CustomHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

//TODO: don't know how to get num of clams, using lot as temp val
function getRowSum(panel) {
  let total = 0;
  for (let i = 0; i < panel.data.length; i += 1) {
    total += panel.data[i].clams;
  }
  return total;
}

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [rakers, setRakers] = useState(null);
  const [clams, setClams] = useState(null);

  // sort the surveys by last time accessed
  surveys.sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleRowClick = record => {
    record.panelTotal = record.clams;
    console.log(record);
    setModalData(record);
    // Get the ID of the survey from the row
    const surveyId = record.id;

    //Make a request to the backend to get the survey information
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`http://localhost:3001/surveys/survey/${surveyId}/`);
        const json = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSurvey();

    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalData(null);
    setModalVisible(false);
  };

  const panels = [];

  const beachDict = new Object();

  const getSurveysFromDB = async () => {
    const res = (await GSPBackend.get('http://localhost:3001/surveys')).data.map(survey => ({
      ...survey,
    }));
    return res;
  };

  const fetchSurveysFromDB = async () => {
    const surveysFromDB = await getSurveysFromDB();
    setSurveys(surveysFromDB);
  };

  const getRakersFromDB = async () => {
    const res = (await GSPBackend.get('http://localhost:3001/rakers')).data.map(raker => ({
      ...raker,
    }));
    return res;
  };

  const fetchRakersFromDB = async () => {
    const rakersFromDB = await getRakersFromDB();
    setRakers(rakersFromDB);
  };

  const fetchClamsFromDB = async () => {
    const clamsFromDB = await getClamsFromDB();
    setClams(clamsFromDB);
  };

  const getClamsFromDB = async () => {
    const res = (await GSPBackend.get('http://localhost:3001/clams')).data.map(clam => ({
      ...clam,
    }));
    return res;
  };

  useEffect(() => {
    fetchSurveysFromDB();
    fetchRakersFromDB();
    fetchClamsFromDB();
  }, []);

  // parse the data to make it easier to put into the collapse/ recentcard elements
  for (let i = 0; i < surveys.length; i = i + 1) {
    let surveyDate = new Date(surveys[i].date);
    let fixedDate = new Date(surveyDate);
    let formattedDate = fixedDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    surveys[i].date = formattedDate;

    if (surveys[i].location in beachDict) {
      beachDict[surveys[i].location].push(surveys[i]);
    } else {
      beachDict[surveys[i].location] = [surveys[i]];
    }
  }

  const getRakersFromSurvey = surveyId => {
    let res = [];
    for (let raker in rakers) {
      if (rakers[raker].surveyId === surveyId) {
        res.push(rakers[raker]);
      }
    }
    return res;
  };

  const getClamsFromRaker = rakerId => {
    let res = [];

    for (let clam in clams) {
      if (clams[clam].rakerId === rakerId) {
        res.push(clams[clam]);
      }
    }
    return res;
  };

  let data = [];

  // data: icon, zone, date, clams found in zone
  for (let survey in surveys) {
    const zones = new Object();
    zones['timeWorked'] = 0;
    zones['distRaked'] = 0;
    zones['beach'] = surveys[survey].location;
    zones['date'] = surveys[survey].date;
    let rakes = getRakersFromSurvey(surveys[survey].id);
    for (let rake in rakes) {
      zones['zone'] = rakes[rake].rakeArea;

      let clams = getClamsFromRaker(rakes[rake].id);
      console.log(clams);
      zones['clamList'] = clams;
      zones['clams'] = clams.length;
      zones['rakers'] = rakes;
      zones['timeWorked'] = getHoursBetween(rakes[rake].startTime, rakes[rake].endTime);
      zones['distRaked'] += calculateDistance(
        rakes[rake].startLat,
        rakes[rake].startLong,
        rakes[rake].endLat,
        rakes[rake].endLong,
      );

      let length = 0;
      let width = 0;
      let weight = 0;
      for (let i = 0; i < zones['clamList'].length; i++) {
        length += zones['clamList'][i].length;
        width += zones['clamList'][i].width;
        weight += zones['clamList'][i].weight;
      }

      zones['clamWidthsCombined'] = width;
      zones['clamLengthsCombined'] = length;
      zones['clamWeightsCombined'] = weight;
      zones['clamDensity'] = calculateClamDensity(
        zones['clams'],
        zones['distRaked'],
        zones['clamWidthsCombined'],
      );
    }
    data.push(zones);
  }

  const groupedData = data.reduce((groups, zone) => {
    const beach = zone.beach;
    if (!groups[beach]) {
      groups[beach] = [];
    }
    groups[beach].push(zone);
    return groups;
  }, {});

  for (let beach in groupedData) {
    panels.push({
      title: beach,
      data: groupedData[beach],
      count: 0,
    });
  }

  console.log(groupedData);

  function getHoursBetween(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffHrs = Math.floor(diffMs / 3600000);
    return diffHrs;
  }

  function calculateClamDensity(clamCount, distanceRaked, rakeWidth) {
    const lengthRaked = distanceRaked * 1000; // convert to meters
    const areaRaked = lengthRaked * rakeWidth; // in square meters
    const clamDensity = clamCount / areaRaked; // clams per square meter
    return clamDensity;
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance; // in km
  }

  //TODO: find way to put an icon
  const columns = [
    { title: '', dataIndex: 'icon' },
    { title: '', dataIndex: 'zone' },
    { title: '', dataIndex: 'date' },
    { title: '', dataIndex: 'clams' }, //clams go here
  ];

  return (
    <div>
      <h1>dashboard</h1>
      <div className="dashboard-panels">
        <div className={styles.allsections}>
          <Collapse accordion>
            {panels.map(panel => (
              <Collapse.Panel
                key={panel.title}
                header={<CustomHeader title={panel.title.toString()} count={getRowSum(panel)} />}
              >
                <Table
                  columns={columns}
                  dataSource={panel.data}
                  pagination={false}
                  rowClassName={index => (index === 0 ? styles.firstRow : '')}
                  onRow={record => {
                    //eslint-disable-line
                    const updatedRecord = { ...record, panelTotal: getRowSum(panel) };
                    return {
                      onClick: () => {
                        handleRowClick(updatedRecord);
                      },
                    };
                  }}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </div>
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={handleModalClose}
        closable={false}
        width="65em"
        height="40vh"
      >
        {modalData && (
          <div className={styles.modalcontainer}>
            <div className={styles.modalheader}>
              <div className={styles.modaltitle}>{modalData.beach}</div>
              <div>{`Clams: ${modalData.panelTotal}`}</div>
            </div>
            <div className={styles.modalDate}>{modalData.date}</div>
            <div className={styles.summaryContainer}>
              <div className={styles.summaryTableTitle}> Summary </div>
              <SummaryTable data={modalData}></SummaryTable>
              {/* <div className={styles.summaryTable}>
                <div className={styles.cell}> {modalData.rakers.length} </div>
                <div className={styles.cell}> {modalData.clamList.length} </div>
                <div className={styles.cell}> {modalData.timeWorked} </div>
                <div className={styles.cell}> {(modalData.clamList.length /modalData.timeWorked).toFixed(2) } </div>
                <div className={styles.cell}> {(modalData.clamLengthsCombined / modalData.clamList.length).toFixed(2)} </div>
                <div className={styles.cell}> {(modalData.clamWidthsCombined / modalData.clamList.length).toFixed(2)} </div>
                <div className={styles.cell}> {(modalData.clamWeightsCombined / modalData.clamList.length).toFixed(2)} </div>
                <div className={styles.cell}> {modalData.distRaked} </div>
                <div className={styles.cell}> {modalData.clamDensity} </div>
              </div> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
