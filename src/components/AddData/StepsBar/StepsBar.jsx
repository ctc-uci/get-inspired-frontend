import { React } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';

function StepsBar({ curStep, items, setStepFunc }) {
  return (
    <div>
      <Steps size="small" current={curStep} items={items} onChange={setStepFunc} />
    </div>
  );
}

StepsBar.defaultProps = {
  curStep: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  setStepFunc: PropTypes.func,
};

StepsBar.propTypes = {
  curStep: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  setStepFunc: PropTypes.func,
};

export default StepsBar;
