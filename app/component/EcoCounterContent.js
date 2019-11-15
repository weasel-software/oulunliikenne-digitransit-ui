import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import moment from 'moment';
import get from 'lodash/get';
import LineChart from './LineChart';
import Icon from './Icon';

export const WALKING = 1;
export const CYCLING = 2;
const STEPS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const getTitle = (step, formatMessage) => {
  switch (step) {
    case STEPS.HOUR:
      return formatMessage(
        {
          id: 'hourly-with-date',
        },
        {
          date: moment()
            .subtract(1, 'day')
            .format('D.M.Y'),
        },
      );
    case STEPS.DAY:
      return formatMessage({ id: 'daily' });
    case STEPS.WEEK:
      return formatMessage({ id: 'weekly' });
    case STEPS.MONTH:
      return formatMessage({ id: 'monthly' });
    default:
      return '';
  }
};

const formatDateByStep = (date, step) => {
  const m = moment(date);
  if (step === STEPS.HOUR) {
    return m.format('HH:mm');
  } else if (step === STEPS.DAY) {
    return m.format('DD.MM.');
  } else if (step === STEPS.WEEK) {
    return m.format('DD.MM.');
  }
  return m.format('MMM');
};

const getChannelDirection = (id, channels = []) => {
  const channel = channels.find(c => c.id === id);

  if (!channel) {
    return 5;
  }

  return get(channel, 'direction', 5);
};

const EcoCounterContent = ({
  channel1,
  channel2,
  channel1Id,
  channel2Id,
  channels,
  changeUserType,
  userType,
  step,
  changeStep,
  formatMessage,
  availableUserTypes,
}) => {
  const labels = get(channel1, 'siteData', []).map(({ date }) =>
    formatDateByStep(date, step),
  );
  const channel1Counts = get(channel1, 'siteData', []).map(
    ({ counts }) => (!counts ? 0 : counts),
  );

  const datasets = [
    {
      label: formatMessage({
        id: `eco-counter-direction-${getChannelDirection(
          channel1Id,
          channels,
        )}`,
      }),
      data: channel1Counts,
      borderColor: '#dc3545',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];

  if (channel2) {
    const channel2Counts = get(channel2, 'siteData', []).map(
      ({ counts }) => (!counts ? 0 : counts),
    );

    datasets.push({
      label: formatMessage({
        id: `eco-counter-direction-${getChannelDirection(
          channel2Id,
          channels,
        )}`,
      }),
      data: channel2Counts,
      borderColor: '#00AFFF',
      backgroundColor: 'rgba(0,0,0,0)',
    });
  }
  return (
    <div className="eco-counter-content">
      <h5>{getTitle(step, formatMessage)}</h5>
      <LineChart datasets={datasets} labels={labels} title="Test" />
      <div className="button-row">
        {availableUserTypes.includes(WALKING) && (
          <EcoCounterButton
            condition={userType === WALKING}
            onClick={() => changeUserType(WALKING)}
          >
            <Icon img="icon-icon_walk" viewBox="0 0 25 25" />
          </EcoCounterButton>
        )}
        {availableUserTypes.includes(CYCLING) && (
          <EcoCounterButton
            condition={userType === CYCLING}
            onClick={() => changeUserType(CYCLING)}
          >
            <Icon img="icon-icon_bicycle-withoutBox" viewBox="0 0 25 25" />
          </EcoCounterButton>
        )}
      </div>
      <div className="button-row">
        <EcoCounterButton
          condition={step === STEPS.HOUR}
          onClick={() => changeStep(STEPS.HOUR)}
          isSmall
        >
          {formatMessage({ id: 'hourly' })}
        </EcoCounterButton>
        <EcoCounterButton
          condition={step === STEPS.DAY}
          onClick={() => changeStep(STEPS.DAY)}
          isSmall
        >
          {formatMessage({ id: 'daily' })}
        </EcoCounterButton>
        <EcoCounterButton
          condition={step === STEPS.WEEK}
          onClick={() => changeStep(STEPS.WEEK)}
          isSmall
        >
          {formatMessage({ id: 'weekly' })}
        </EcoCounterButton>
        <EcoCounterButton
          condition={step === STEPS.MONTH}
          onClick={() => changeStep(STEPS.MONTH)}
          isSmall
        >
          {formatMessage({ id: 'monthly' })}
        </EcoCounterButton>
      </div>
    </div>
  );
};

const EcoCounterButton = ({ condition, isSmall, children, onClick }) => (
  <button
    className={cx('eco-counter-button', {
      'eco-counter-button--small': isSmall,
      'eco-counter-button--active': condition,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);

EcoCounterButton.propTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isSmall: PropTypes.bool,
};

EcoCounterButton.defaultProps = {
  isSmall: false,
};

const siteDataShape = PropTypes.shape({
  date: PropTypes.string,
  counts: PropTypes.number,
  status: PropTypes.number,
});

const channelShape = PropTypes.shape({
  siteData: PropTypes.arrayOf(siteDataShape),
});

EcoCounterContent.propTypes = {
  channel1: channelShape.isRequired,
  channel2: channelShape,
  channel1Id: PropTypes.string.isRequired,
  channel2Id: PropTypes.string,
  channels: PropTypes.array.isRequired,
  changeUserType: PropTypes.func.isRequired,
  userType: PropTypes.number.isRequired,
  changeStep: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
  formatMessage: PropTypes.func.isRequired,
  availableUserTypes: PropTypes.array.isRequired,
};

EcoCounterContent.defaultProps = {
  channel2: null,
  channel2Id: null,
};

const ConnectedComponent = Relay.createContainer(EcoCounterContent, {
  initialVariables: {
    channel1Id: null,
    channel2Id: null,
    domain: null,
    step: null,
    begin: null,
    end: null,
  },
  fragments: {
    channel1: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel1Id, 
          domain: $domain, 
          step: $step, 
          begin: $begin, 
          end: $end
        ) {        
          date
          counts
          status
        }
      }
    `,
    channel2: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel2Id, 
          domain: $domain, 
          step: $step, 
          begin: $begin, 
          end: $end
        ) {        
          date
          counts
          status
        }
      }
    `,
  },
});

export {
  ConnectedComponent as default,
  EcoCounterContent as Component,
  EcoCounterButton,
};
