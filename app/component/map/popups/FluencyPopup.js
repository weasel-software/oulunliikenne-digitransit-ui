import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import FluencyContent from '../../FluencyContent';

function FluencyPopup(
  { name, averageSpeed, speedLimit, trafficDirection, trafficFlow },
  { intl },
) {
  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'fluency',
            defaultMessage: 'Fluency',
          })}
          description={name}
          icon="icon-icon_fluency"
          unlinked
        />
        <FluencyContent
          averageSpeed={averageSpeed}
          speedLimit={speedLimit}
          trafficDirection={trafficDirection}
          trafficFlow={trafficFlow}
        />
      </Card>
    </div>
  );
}

FluencyPopup.description = (
  <div>
    <p>Renders a fluency popup.</p>
    <ComponentUsageExample description="">
      <FluencyPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

FluencyPopup.propTypes = {
  name: PropTypes.string.isRequired,
  trafficFlow: PropTypes.string,
  averageSpeed: PropTypes.number,
  speedLimit: PropTypes.number,
  trafficDirection: PropTypes.number,
};

FluencyPopup.defaultProps = {
  trafficFlow: null,
  averageSpeed: null,
  speedLimit: null,
  trafficDirection: null,
};

FluencyPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default FluencyPopup;
