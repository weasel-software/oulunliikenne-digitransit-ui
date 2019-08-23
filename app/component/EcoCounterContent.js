import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import moment from 'moment';
import LineChart from './LineChart';
import Icon from './Icon';

const WALKING = 1;
const CYCLING = 2;
const STEPS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
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

const EcoCounterContent = ({
  data: { outData, inData },
  changeUserType,
  userType,
  step,
  changeStep,
  formatMessage,
  availableUserTypes,
  directionAvailable,
}) => {
  const labels = inData.map(({ date }) => formatDateByStep(date, step));
  const outDataCounts = outData.map(({ counts }) => (!counts ? 0 : counts));
  const inDataCounts = inData.map(({ counts }) => (!counts ? 0 : counts));
  const datasets = [
    {
      label: directionAvailable ? formatMessage({ id: 'from-city' }) : '',
      data: outDataCounts,
      borderColor: '#dc3545',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      label: directionAvailable ? formatMessage({ id: 'to-city' }) : '',
      data: inDataCounts,
      borderColor: '#00AFFF',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];
  return (
    <div className="ecocounter-content">
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

const EcoCounterButton = ({
  condition,
  isSmall = false,
  children,
  onClick,
}) => (
  <button
    className={cx('ecocounter-button', {
      'ecocounter-button--small': isSmall,
      'ecocounter-button--active': condition,
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

EcoCounterContent.propTypes = {
  data: PropTypes.object.isRequired,
  changeUserType: PropTypes.func.isRequired,
  userType: PropTypes.number.isRequired,
  changeStep: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
  formatMessage: PropTypes.func.isRequired,
  availableUserTypes: PropTypes.array.isRequired,
  directionAvailable: PropTypes.bool.isRequired,
};

const ConnectedComponent = Relay.createContainer(EcoCounterContent, {
  initialVariables: {
    outId: null,
    inId: null,
    domain: null,
    step: null,
    begin: null,
    end: null,
  },
  fragments: {
    data: () => Relay.QL`
      fragment on Query {
        outData: ecoCounterSiteData(
          id: $outId, 
          domain: $domain, 
          step: $step, 
          begin: $begin, 
          end: $end
        ) {        
          date
          counts
          status
        }
        inData: ecoCounterSiteData(
          id: $inId, 
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

export { ConnectedComponent as default, EcoCounterContent as Component };
