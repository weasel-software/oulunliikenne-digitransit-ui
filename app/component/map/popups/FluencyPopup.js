import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import FluencyContent from '../../FluencyContent';

function FluencyPopup(
  { name, averageSpeed, trafficFlow, measuredTime },
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
          trafficFlow={trafficFlow}
          measuredTime={measuredTime}
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
  measuredTime: PropTypes.string,
};

FluencyPopup.defaultProps = {
  trafficFlow: null,
  averageSpeed: null,
  measuredTime: null,
};

FluencyPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default FluencyPopup;
