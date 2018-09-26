import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import MarkerPopupBottom from '../MarkerPopupBottom';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import RoadworkContent from '../../RoadworkContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function RoadworkPopup(
  { locationName, comment, start, end },
  { intl, router, location }
) {
  const openMoreInfoModal = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: locationName,
        moreInfoModalContent: (
          <RoadworkContent
            comment={comment}
            start={start}
            end={end}
          />
        ),
      },
    });
  };

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'roadwork',
            defaultMessage: 'Roadwork',
          })}
          description={locationName}
          icon='icon-icon_roadwork'
          unlinked
        />
        <RoadworkContent
          locationName={locationName}
          comment={comment}
          start={start}
          end={end}
        />
        <span
          className="read-more"
          onClick={openMoreInfoModal}
        >
          {intl.formatMessage({
            id: 'more',
            defaultMessage: 'More',
          }) + '>'}
        </span>
      </Card>
    </div>
  );
};

RoadworkPopup.displayName = 'RoadworkPopup';

RoadworkPopup.description = (
  <div>
    <p>Renders a road work popup.</p>
    <ComponentUsageExample description="">
      <RoadworkPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

RoadworkPopup.propTypes = {
  locationName: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

RoadworkPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

export default RoadworkPopup;
