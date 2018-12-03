import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import connectToStores from 'fluxible-addons-react/connectToStores';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import DisorderContent from '../../DisorderContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function DisorderPopup(
  { trafficDisorder, trafficAnnouncement, lang },
  { intl, router, location, config: { defaultLanguage } },
) {
  const disorderItem = trafficDisorder; // || trafficAnnouncement;

  if (!disorderItem) {
    return null;
  }

  const { startTime, endTime, description, geojson } = disorderItem;
  const locations = geojson.features.map(item => item.properties);
  const firstLocation = locations.length ? locations[0].firstName : '';
  const lastLocation =
    locations.length > 1
      ? ` - ${locations[locations.length - 1].firstName}`
      : '';
  const locationName = `${firstLocation}${lastLocation}`;
  const comment = description[lang] || description[defaultLanguage] || '';

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
  trafficDisorder: PropTypes.object,
  // trafficAnnouncement: PropTypes.object,
  lang: PropTypes.string.isRequired,
};

DisorderPopup.defaultProps = {
  trafficDisorder: null,
  // trafficAnnouncement: null,
};

DisorderPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default Relay.createContainer(
  connectToStores(DisorderPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      trafficDisorder: () => Relay.QL`
        fragment on TrafficDisorder {
          disorderId
          severity
          status
          startTime
          endTime
          description {
            fi
            sv
            en
          }
          geojson
        }
      `,
      /* trafficAnnouncement: () => Relay.QL`
        fragment on TrafficAnnouncement {
          announcementId
          severity
          status
          startTime
          endTime
          description {
            fi
            sv
            en
          }
          geojson
        }
      `, */
    },
  },
);
