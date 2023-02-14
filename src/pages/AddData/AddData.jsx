import React, { useState, useCallback } from 'react';
import StepsBar from '../../components/AddData/StepsBar';
import SurveyForm from '../../components/AddData/SurveyForm';
import ImportCSV from '../../components/AddData/ImportCSV';
import './AddData.css';

const AddData = () => {
  const [curStep, setCurStep] = useState(0);
  const incrStep = useCallback(() => {
    setCurStep(prevStep => {
      return prevStep + 1;
    });
  });
  const decrStep = useCallback(() => {
    setCurStep(prevStep => {
      return prevStep - 1;
    });
  });

  return (
    <div>
      <div className="app-data-heading">
        <h3 style={{ fontFamily: 'Roboto' }}>Add Data Form</h3>
        <StepsBar curStep={curStep} />
      </div>
      {curStep === 0 && <SurveyForm incrStep={incrStep} />}
      {curStep === 1 && <ImportCSV incrStep={incrStep} decrStep={decrStep} typeOfData="Clams" />}
    </div>
  );
};

export default AddData;
