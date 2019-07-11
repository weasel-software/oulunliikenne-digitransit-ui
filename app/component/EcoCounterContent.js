import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import moment from 'moment';
import LineChart from './LineChart';

const EcoCounterContent = ({ data: { outData, inData } }) => {
  const labels = inData.map(({ date }) => moment().diff(moment(date), 'h'));
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
  return <LineChart datasets={datasets} labels={labels} />;
};

EcoCounterContent.propTypes = {
  data: PropTypes.object.isRequired,
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
