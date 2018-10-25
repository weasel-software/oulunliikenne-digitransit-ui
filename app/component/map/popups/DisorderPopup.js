import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import DisorderContent from '../../DisorderContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function DisorderPopup({ disorder }, { intl, router, location }) {
  const { startTime, endTime, comments, geojson } = disorder;
  const locations = geojson.features.map(item => item.properties);
  const firstLocation = locations.length ? locations[0].firstName : '';
  const lastLocation =
    locations.length > 1
      ? ` - ${locations[locations.length - 1].firstName}`
      : '';
  const locationName = `${firstLocation}${lastLocation}`;
  const comment = comments.join('\n\n');

  const openMoreInfoModal = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: locationName,
        moreInfoModalContent: (
          <DisorderContent comment={comment} start={startTime} end={endTime} />
        ),
      },
    });
  };

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'traffic-restriction',
            defaultMessage: 'Traffic restriction',
          })}
          description={locationName}
          icon="icon-icon_disorder"
          unlinked
        />
        <DisorderContent
          locationName={locationName}
          comment={comment}
          start={startTime}
          end={endTime}
        />
        <button className="read-more" onClick={openMoreInfoModal}>
          {`${intl.formatMessage({
            id: 'more',
            defaultMessage: 'More',
          })}>`}
        </button>
      </Card>
    </div>
  );
}

DisorderPopup.displayName = 'DisorderPopup';

DisorderPopup.description = (
  <div>
    <p>Renders a road work popup.</p>
    <ComponentUsageExample description="">
      <DisorderPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

DisorderPopup.propTypes = {
  disorder: PropTypes.object.isRequired,
};

DisorderPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

export default Relay.createContainer(DisorderPopup, {
  fragments: {
    disorder: () => Relay.QL`
      fragment on Disorder {
        disruptionId
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
