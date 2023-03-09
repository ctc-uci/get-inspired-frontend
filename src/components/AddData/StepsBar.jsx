import { React } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';

function StepsBar({ curStep }) {
  return (
    <div>
      <Steps
        size="small"
        current={curStep}
        items={[
          {
            title: 'Survey',
          },
          {
            title: 'Clams',
          },
          {
            title: 'Raker',
          },
          {
            title: 'Review',
          },
        ]}
      />
    </div>
  );
}

StepsBar.defaultProps = {
  curStep: PropTypes.number,
};

StepsBar.propTypes = {
  curStep: PropTypes.number,
};

export default StepsBar;
