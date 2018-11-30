import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import RoadConditionContent from '../../RoadConditionContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function RoadConditionPopup({ station }, { intl }) {
  const name = get(station, 'geojson.features[0].properties.description');

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'road-condition',
            defaultMessage: 'Road condition',
          })}
          description={name}
          icon="icon-icon_road_condition"
          unlinked
        />
        <RoadConditionContent
          forecasts={station.roadConditionForecasts}
          measuredTime={station.measuredTime}
        />
      </Card>
    </div>
  );
}

RoadConditionPopup.displayName = 'TmsStationPopup';

RoadConditionPopup.description = (
  <div>
    <p>Renders a road condition popup.</p>
    <ComponentUsageExample description="">
      <RoadConditionPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

RoadConditionPopup.propTypes = {
  station: PropTypes.object.isRequired,
};

RoadConditionPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(RoadConditionPopup, {
  fragments: {
    station: () => Relay.QL`
      fragment on RoadCondition {
        roadConditionId
        measuredTime
        roadConditionForecasts {
          forecastName
          type
          weatherSymbol
          windSpeed
          windDirection
          roadTemperature
          temperature
          overallRoadCondition
          reliability
        }
        geojson
      }
    `,
  },
});
