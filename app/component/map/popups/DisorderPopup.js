import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import MarkerPopupBottom from '../MarkerPopupBottom';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import DisorderContent from '../../DisorderContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function DisorderPopup(
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
          <DisorderContent
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
            id: 'traffic-restriction',
            defaultMessage: 'Traffic restriction',
          })}
          description={locationName}
          icon='icon-icon_disorder'
          unlinked
        />
        <DisorderContent
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
  locationName: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
};

DisorderPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

export default DisorderPopup;
