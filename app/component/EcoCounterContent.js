import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import moment from 'moment';
import LineChart from './LineChart';

const EcoCounterContent = ({ data: { ecoCounterSiteData } }) => {
  const labels = ecoCounterSiteData.map(({ date }) =>
    moment(date).format('HH'),
  );
  const data = ecoCounterSiteData.map(({ counts }) => (!counts ? 0 : counts));
  return <LineChart data={data} labels={labels} />;
};

EcoCounterContent.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Relay.createContainer(EcoCounterContent, {
  initialVariables: {
    id: null,
    domain: null,
    step: null,
    begin: null,
    end: null,
  },
  fragments: {
    data: () => Relay.QL`
      fragment on Query {
        ecoCounterSiteData(
          id: $id, 
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
