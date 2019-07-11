import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import moment from 'moment';
import LineChart from './LineChart';
import Icon from './Icon';

const EcoCounterContent = ({
  data: { outData, inData },
  changeUserType,
  userType,
}) => {
  const labels = inData.map(
    ({ date }) => `${moment().diff(moment(date), 'h')}h`,
  );
  const outDataCounts = outData.map(({ counts }) => (!counts ? 0 : counts));
  const inDataCounts = inData.map(({ counts }) => (!counts ? 0 : counts));
  const datasets = [
    {
      label: 'Keskustasta',
      data: outDataCounts,
      borderColor: '#dc3545',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      label: 'Keskustaan',
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
          disabled={userType === 1}
          className="ecocounter-button"
          onClick={() => changeUserType(1)}
        >
          <Icon img="icon-icon_bicycle-withoutBox" viewBox="0 0 25 25" />
        </button>
        <button
          disabled={userType === 2}
          className="ecocounter-button"
          onClick={() => changeUserType(2)}
        >
          <Icon img="icon-icon_walk" viewBox="0 0 25 25" />
        </button>
      </div>
    </div>
  );
};

EcoCounterContent.propTypes = {
  data: PropTypes.object.isRequired,
  changeUserType: PropTypes.func.isRequired,
  userType: PropTypes.number.isRequired,
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
