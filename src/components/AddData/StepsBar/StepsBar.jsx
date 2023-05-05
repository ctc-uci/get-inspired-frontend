import { React } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';

function StepsBar({ curStep, titleArray, setStepFunc }) {
  return (
    <div>
      <Steps size="small" current={curStep} items={titleArray} onChange={setStepFunc} />
    </div>
  );
}

StepsBar.defaultProps = {
  curStep: PropTypes.number,
  titleArray: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  setStepFunc: PropTypes.func,
};

StepsBar.propTypes = {
  curStep: PropTypes.number,
  titleArray: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
  setStepFunc: PropTypes.func,
};

export default StepsBar;
