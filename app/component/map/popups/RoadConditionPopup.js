import PropTypes from 'prop-types';
import React from 'react';
// import Relay from 'react-relay/classic';
// import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';

function RoadConditionPopup({ station, lang }, { intl }) {
  const localName = station.names[lang] || station.name;

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'road-weather',
            defaultMessage: 'Road weather',
          })}
          description={localName}
          icon="icon-icon_weather-station"
          unlinked
        />
      </Card>
    </div>
  );
}

RoadConditionPopup.displayName = 'RoadConditionPopup';

RoadConditionPopup.description = (
  <div>
    <p>Renders a road condition popup.</p>
    <ComponentUsageExample description="">
      <RoadConditionPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

RoadConditionPopup.propTypes = {
  lang: PropTypes.string.isRequired,
  station: PropTypes.object, // .isRequired,
};

RoadConditionPopup.contextTypes = {
  intl: intlShape.isRequired,
};

RoadConditionPopup.defaultProps = {
  station: {
    name: 'TEST',
    names: [],
  },
};

export default RoadConditionPopup;
