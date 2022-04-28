import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import RoadSignContent from '../../RoadSignContent';
import { getRoadSignIconId } from '../../../util/mapIconUtils';

function RoadSignPopup({ roadSign }, { intl }) {
  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'road-sign',
            defaultMessage: 'Road sign',
          })}
          description={roadSign.roadSignId}
          icon={getRoadSignIconId(
            roadSign.type,
            roadSign.displayValue,
            roadSign.severity,
          )}
          unlinked
        />
        <RoadSignContent roadSign={roadSign} />
      </Card>
    </div>
  );
}

RoadSignPopup.displayName = 'TmsStationPopup';

RoadSignPopup.description = (
  <div>
    <p>Renders a road condition popup.</p>
    <ComponentUsageExample description="">
      <RoadSignPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

RoadSignPopup.propTypes = {
  roadSign: PropTypes.object.isRequired,
};

RoadSignPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(RoadSignPopup, {
  fragments: {
    roadSign: () => Relay.QL`
      fragment on VariableRoadSign {
        roadSignId
        type
        direction
        carriageway
        displayValue
        effectDate
        cause
        reliability
        roadAddress
        lat
        lon
        severity
        textRows {
          screen
          rowNumber
          text
        }
      }
    `,
  },
});
