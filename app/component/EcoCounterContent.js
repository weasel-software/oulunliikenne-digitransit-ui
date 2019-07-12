import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
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

const formatDateByStep = (date, step, formatMsg) => {
  const m = moment(date);
  if (step === STEPS.HOUR) {
    const diff = moment().diff(m, 'h');
    return diff === 0 ? formatMsg({ id: 'now' }) : m.format('HH:mm');
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
}) => {
  const labels = inData.map(({ date }) =>
    formatDateByStep(date, step, formatMessage),
  );
  const outDataCounts = outData.map(({ counts }) => (!counts ? 0 : counts));
  const inDataCounts = inData.map(({ counts }) => (!counts ? 0 : counts));
  const datasets = [
    {
      label: formatMessage({ id: 'from-city' }),
      data: outDataCounts,
      borderColor: '#dc3545',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      label: formatMessage({ id: 'to-city' }),
      data: inDataCounts,
      borderColor: '#00AFFF',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];
  return (
    <div className="ecocounter-content">
      <LineChart datasets={datasets} labels={labels} />
      <div className="button-row">
        <button
          disabled={userType === WALKING}
          className="ecocounter-button"
          onClick={() => changeUserType(WALKING)}
        >
          <Icon img="icon-icon_bicycle-withoutBox" viewBox="0 0 25 25" />
        </button>
        <button
          disabled={userType === CYCLING}
          className="ecocounter-button"
          onClick={() => changeUserType(CYCLING)}
        >
          <Icon img="icon-icon_walk" viewBox="0 0 25 25" />
        </button>
      </div>
      <div className="button-row">
        <button
          disabled={step === STEPS.HOUR}
          className="ecocounter-button ecocounter-button--small"
          onClick={() => changeStep(STEPS.HOUR)}
        >
          {formatMessage({ id: 'hourly' })}
        </button>
        <button
          disabled={step === STEPS.DAY}
          className="ecocounter-button ecocounter-button--small"
          onClick={() => changeStep(STEPS.DAY)}
        >
          {formatMessage({ id: 'daily' })}
        </button>
        <button
          disabled={step === STEPS.WEEK}
          className="ecocounter-button ecocounter-button--small"
          onClick={() => changeStep(STEPS.WEEK)}
        >
          {formatMessage({ id: 'weekly' })}
        </button>
        <button
          disabled={step === STEPS.MONTH}
          className="ecocounter-button ecocounter-button--small"
          onClick={() => changeStep(STEPS.MONTH)}
        >
          {formatMessage({ id: 'monthly' })}
        </button>
      </div>
    </div>
  );
};

EcoCounterContent.propTypes = {
  data: PropTypes.object.isRequired,
  changeUserType: PropTypes.func.isRequired,
  userType: PropTypes.number.isRequired,
  changeStep: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
  formatMessage: PropTypes.func.isRequired,
};

export default Relay.createContainer(EcoCounterContent, {
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
