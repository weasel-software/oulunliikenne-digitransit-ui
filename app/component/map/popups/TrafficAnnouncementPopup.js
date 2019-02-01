import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import connectToStores from 'fluxible-addons-react/connectToStores';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import TrafficAnnouncementContent from '../../TrafficAnnouncementContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function TrafficAnnouncementPopup(
  { trafficAnnouncement, lang },
  { intl, router, location, config: { defaultLanguage } },
) {
  if (!trafficAnnouncement) {
    return null;
  }

  const titleLocal =
    trafficAnnouncement.title[lang] ||
    trafficAnnouncement.title[defaultLanguage] ||
    '';

  const openMoreInfoModal = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: titleLocal,
        moreInfoModalContent: (
          <TrafficAnnouncementContent
            trafficAnnouncement={trafficAnnouncement}
            type="extended"
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
            id: 'traffic-restriction',
            defaultMessage: 'Traffic restriction',
          })}
          description={titleLocal}
          icon="icon-icon_disorder"
          unlinked
        />
        <TrafficAnnouncementContent trafficAnnouncement={trafficAnnouncement} />
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

TrafficAnnouncementPopup.displayName = 'TrafficAnnouncementPopup';

TrafficAnnouncementPopup.description = (
  <div>
    <p>Renders a traffic announcement popup.</p>
    <ComponentUsageExample description="">
      <TrafficAnnouncementPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

TrafficAnnouncementPopup.propTypes = {
  trafficAnnouncement: PropTypes.object,
  lang: PropTypes.string.isRequired,
};

TrafficAnnouncementPopup.defaultProps = {
  trafficAnnouncement: null,
};

TrafficAnnouncementPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default Relay.createContainer(
  connectToStores(TrafficAnnouncementPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      trafficAnnouncement: () => Relay.QL`
        fragment on TrafficAnnouncement {
          announcementId
          class {
            class
            subclass
          }
          description {
            fi
            sv
            en
          }
          severity
          status
          startTime
          endTime
          geojson
          title {
            fi
            sv
            en
          }
          modesOfTransport
          trafficDirection
          temporarySpeedLimit
          duration
          additionalInfo
          detour
          oversizeLoad
          vehicleSizeLimit
          url
          imageUrl
        }
      `,
    },
  },
);
