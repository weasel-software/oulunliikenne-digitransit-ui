import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import MarkerPopupBottom from '../MarkerPopupBottom';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import RoadworkContent from '../../RoadworkContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function RoadWorkPopup(props, context) {
  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={context.intl.formatMessage({
            id: 'roadwork',
            defaultMessage: 'Roadwork',
          })}
          description={props.locationName}
          icon='icon-icon_roadwork'
          unlinked
        />
        <RoadworkContent
          message={props.comment}
        />
      </Card>
    </div>
  );
}

RoadWorkPopup.description = (
  <div>
    <p>Renders a road work popup.</p>
    <ComponentUsageExample description="">
      <RoadWorkPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

RoadWorkPopup.propTypes = {
  locationName: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

RoadWorkPopup.contextTypes = {
  intl: intlShape.isRequired
};

export default RoadWorkPopup;
