import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { intlShape } from 'react-intl';
import Icon from './Icon';
import ComponentUsageExample from './ComponentUsageExample';
import ItineraryTimePicker from './ItineraryTimePicker';

export default function TimeSelectors(
  { time, dates, changeTime, changeDate },
  { intl },
) {
  const ariaLabelHours = intl.formatMessage({
    id: 'hour',
    defaultMessage: 'Hour',
  });

  const ariaLabelMinutes = intl.formatMessage({
    id: 'minutes',
    defaultMessage: 'Minutes',
  });

  const ariaLabelDate = intl.formatMessage({
    id: 'date',
    defaultMessage: 'Date',
  });

  return (
    <div className="time-selectors">
      <ItineraryTimePicker
        initHours={time.format('H')}
        initMin={time.format('m')}
        changeTime={changeTime}
        ariaLabelHours={ariaLabelHours}
        ariaLabelMinutes={ariaLabelMinutes}
      />
      <div className="select-wrapper">
        <select
          className="date"
          value={`${time.unix()}`}
          onChange={changeDate}
          aria-label={ariaLabelDate}
        >
          {dates}
        </select>
        <Icon className="fake-select-arrow" img="icon-icon_arrow-dropdown" />
      </div>
    </div>
  );
}

TimeSelectors.propTypes = {
  time: PropTypes.instanceOf(moment).isRequired,
  changeTime: PropTypes.func.isRequired,
  changeDate: PropTypes.func.isRequired,
  dates: PropTypes.arrayOf(PropTypes.element).isRequired,
};

TimeSelectors.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

TimeSelectors.displayName = 'TimeSelectors';

TimeSelectors.description = () => (
  <div>
    <p>A toolbar for changing arriveBy/departAt, date and time</p>
    <ComponentUsageExample>
      <TimeSelectors
        time={moment('2016-05-18 09:30')}
        changeTime={() => {}}
        changeDate={() => {}}
        dates={[
          <option value="2016-05-18" key="2016-05-18">
            Today
          </option>,
        ]}
      />
    </ComponentUsageExample>
  </div>
);
