/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SummaryTable.module.css';

const SummaryTable = props => {
  let data = props.data
  return (
    <div className={styles.summaryTable}>
      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {data.rakers.length}
        </div>
        <div className={styles.dataLabel}>
          People
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
        {data.clamList.length}
        </div>
        <div className={styles.dataLabel}>
          Clams Found
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {data.timeWorked}
        </div>
        <div className={styles.dataLabel}>
          Hours Worked
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {data.distRaked.toFixed(2) + "m"}
        </div>
        <div className={styles.dataLabel}>
         Distance Raked
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {(data.clamList.length /data.timeWorked).toFixed(2) }
        </div>
        <div className={styles.dataLabel}>
         Clams/Man hour
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {data.clamDensity + "m²"}
        </div>
        <div className={styles.dataLabel}>
         Clam Density
        </div>
      </div>

      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {(data.clamLengthsCombined / data.clamList.length).toFixed(2) + "mm"}
        </div>
        <div className={styles.dataLabel}>
         Avg Length
        </div>
      </div>
      <div className={styles.cell}>
        <div className={styles.dataNum}>
          {(data.clamWidthsCombined / data.clamList.length).toFixed(2) + "mm"}
        </div>
      <div className={styles.dataLabel}>
         Avg Width
      </div>
      </div>
      <div className={styles.cell}>
        <div className={styles.dataNum}>
        {(data.clamWeightsCombined / data.clamList.length).toFixed(2) + " lbs"}
        </div>
        <div className={styles.dataLabel}>
         Avg Weight
      </div>
      </div>


    </div>
  );
};


SummaryTable.propTypes = {
  data: PropTypes.shape({
    rakers: PropTypes.arrayOf.isRequired,
    clamList: PropTypes.arrayOf.isRequired,
    timeWorked: PropTypes.number.isRequired,
    distRaked: PropTypes.number.isRequired,
    clamDensity: PropTypes.number.isRequired,
    clamLengthsCombined: PropTypes.number.isRequired,
    clamWidthsCombined: PropTypes.number.isRequired,
    clamWeightsCombined: PropTypes.number.isRequired,
  }).isRequired,
};


export default SummaryTable;
