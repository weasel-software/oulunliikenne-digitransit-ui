import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import RoadworkContent from '../../RoadworkContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function RoadworkPopup({ roadwork }, { intl, router, location }) {
  const { startTime, endTime, comments } = roadwork;
  const locationName = '';
  const comment = comments.join('\n\n');

  // console.log(roadwork);

  const openMoreInfoModal = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: locationName,
        moreInfoModalContent: (
          <RoadworkContent comment={comments} start={startTime} end={endTime} />
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
          icon="icon-icon_roadwork"
          unlinked
        />
        <RoadworkContent
          locationName={locationName}
          comment={comment}
          start={startTime}
          end={endTime}
        />
        <button className="read-more" onClick={openMoreInfoModal}>
          {`${intl.formatMessage({
            id: 'more',
            defaultMessage: 'More',
          })} >`}
        </button>
      </Card>
    </div>
  );
}

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
  roadwork: PropTypes.object.isRequired,
};

RoadworkPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

export default Relay.createContainer(RoadworkPopup, {
  fragments: {
    roadwork: () => Relay.QL`
      fragment on Roadwork {
        roadworkId
        severity
        status
        startTime
        endTime
        comments
        geojson {
          features {
            type
            geometry {
              type
            }
            properties {
              id
              roadName
              firstName
              secondName
            }
          }
        }
      }
    `,
  },
});
