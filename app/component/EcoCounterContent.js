import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

const EcoCounterContent = ({ data }) => {
  console.log('data', data);
  return <p>Data here</p>;
};

EcoCounterContent.propTypes = {
  data: PropTypes.object.isRequired,
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
