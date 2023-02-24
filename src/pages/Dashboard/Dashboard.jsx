import React, { useState } from 'react';
import { Collapse, Button, Table, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './Dashboard.module.css';

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
      <span>{`Total Clams: ${count}`}</span>
    </div>
  );
}

CustomHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

function getRowSum(panel) {
  let total = 0;
  for (let i = 0; i < panel.data.length; i += 1) {
    total += panel.data[i].value;
  }
  return total;
}

const Dashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleRowClick = record => {
    setModalData(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalData(null);
    setModalVisible(false);
  };

  const panels = [
    {
      title: 'Panel 1',
      count: 3,
      data: [
        { name: 'Item 1', date: '2022-03-01', value: 10 },
        { name: 'Item 2', date: '2022-03-02', value: 20 },
        { name: 'Item 3', date: '2022-03-03', value: 30 },
      ],
    },
    {
      title: 'Panel 2',
      count: 5,
      data: [
        { name: 'Item 4', date: '2022-03-04', value: 40 },
        { name: 'Item 5', date: '2022-03-05', value: 50 },
        { name: 'Item 6', date: '2022-03-06', value: 60 },
        { name: 'Item 7', date: '2022-03-07', value: 70 },
        { name: 'Item 8', date: '2022-03-08', value: 80 },
      ],
    },
    {
      title: 'Panel 3',
      count: 7,
      data: [
        { name: 'Item 9', date: '2022-03-09', value: 90 },
        { name: 'Item 10', date: '2022-03-10', value: 100 },
        { name: 'Item 11', date: '2022-03-11', value: 110 },
        { name: 'Item 12', date: '2022-03-12', value: 120 },
        { name: 'Item 13', date: '2022-03-13', value: 130 },
        { name: 'Item 14', date: '2022-03-14', value: 140 },
        { name: 'Item 15', date: '2022-03-15', value: 150 },
      ],
    },
  ];

  const columns = [
    { title: '', dataIndex: 'icon' },
    { title: '', dataIndex: 'name' },
    { title: '', dataIndex: 'date' },
    { title: '', dataIndex: 'value' },
  ];

  return (
    <div>
      <h1>dashboard</h1>
      <div className={styles.allsections}>hi</div>
      <div className="dashboard-panels">
        <div className={styles.sortbuttons}>
          <p className={styles.buttons}>Sort by: </p>
          <Button className={styles.leftbutton}>Beach</Button>
          <Button>Date</Button>
          <Button>Location</Button>
        </div>
        <div className={styles.allsections}>
          <Collapse>
            {panels.map(panel => (
              <Collapse.Panel
                key={panel.title}
                header={<CustomHeader title={panel.title} count={getRowSum(panel)} />}
              >
                <Table
                  columns={columns}
                  dataSource={panel.data}
                  pagination={false}
                  rowClassName={index => (index === 0 ? styles.firstRow : '')}
                  onRow={record => {
                    //eslint-disable-line
                    const updatedRecord = { ...record, panelTotal: getRowSum(panel)};
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
        width="50em"
        height="40vh"
      >
        {modalData && (
          <div className={styles.modalcontainer}>
            <div className={styles.modalheader}>
              <div className={styles.modaltitle}>{modalData.name}</div>
              <div>{`Clams: ${modalData.panelTotal}`}</div>
            </div>
            <div className={styles.modalDate}>{modalData.date}</div>
            <div className={styles.summaryContainer}>
              <div className={styles.summaryTableTitle}> Summary </div>
              <div className={styles.summaryTable}>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
                <div className={styles.cell}> {modalData.value} </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
