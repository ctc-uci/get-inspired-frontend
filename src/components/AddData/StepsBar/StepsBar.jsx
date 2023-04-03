import { React } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';

function StepsBar({ curStep, titleArray }) {
  return (
    <div>
      <Steps size="small" current={curStep} items={titleArray} />
    </div>
  );
}

StepsBar.defaultProps = {
  curStep: PropTypes.number,
  titleArray: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
};

StepsBar.propTypes = {
  curStep: PropTypes.number,
  titleArray: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })),
};

export default StepsBar;
