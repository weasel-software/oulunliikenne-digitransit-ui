import PropTypes from 'prop-types';
import React from 'react';
import get from 'lodash/get';
import { intlShape, FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
const ExtendedContent = ({ trafficAnnouncement }, { intl }) => {
  const {
    severity,
    modesOfTransport,
    temporarySpeedLimit,
    trafficDirection,
    trafficDirectionFreeText,
    duration,
    additionalInfo,
    oversizeLoad,
    vehicleSizeLimit,
    url,
    imageUrls,
  } = trafficAnnouncement;

  let trafficDirectionText = get(trafficDirectionFreeText, intl.locale);
  if (!trafficDirectionText && trafficDirection) {
    trafficDirectionText = intl.formatMessage({
      id: `traffic-announcement-traffic-direction-${trafficDirection.toLowerCase()}`,
      defaultMessage: trafficDirection,
    });
  }

  return (
    <ul className="extended-content">
      {trafficAnnouncement.class &&
        trafficAnnouncement.class.map(item => (
          <li key={`${item.class}_${item.subclass}`}>
            <FormattedMessage
              id={`traffic-announcement-class-${item.class.toLowerCase()}`}
              defaultMessage={item.class}
            >
              {(...content) => <span>{`${content}:`}</span>}
            </FormattedMessage>
            {intl.formatMessage({
              id: `traffic-announcement-subclass-${item.subclass.toLowerCase()}`,
              defaultMessage: item.subclass,
            })}
          </li>
        ))}
      {modesOfTransport && (
        <li>
          <FormattedMessage
            id="traffic-announcement-modes-of-transport"
            defaultMessage="Modes of transport"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {modesOfTransport
            .map(item =>
              intl.formatMessage({
                id: `traffic-announcement-modes-of-transport-${item.toLowerCase()}`,
                defaultMessage: item,
              }),
            )
            .join(', ')}
        </li>
      )}
      {severity && (
        <li>
          <FormattedMessage
            id="traffic-announcement-severity"
            defaultMessage="Severity"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {intl.formatMessage({
            id: `traffic-announcement-severity-${severity.toLowerCase()}`,
            defaultMessage: severity,
          })}
        </li>
      )}
      {trafficDirectionText && (
        <li>
          <FormattedMessage
            id="traffic-announcement-traffic-direction"
            defaultMessage="Direction"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {trafficDirectionText}
        </li>
      )}
      {temporarySpeedLimit && (
        <li>
          <FormattedMessage
            id="traffic-announcement-temporary-speed-limit"
            defaultMessage="Temporary speed limit"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {`${temporarySpeedLimit} km/h`}
        </li>
      )}
      {duration && (
        <li>
          <FormattedMessage
            id="traffic-announcement-duration"
            defaultMessage="Estimated duration"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {intl.formatMessage({
            id: `traffic-announcement-duration-${duration.toLowerCase()}`,
            defaultMessage: duration,
          })}
        </li>
      )}
      {additionalInfo && (
        <li>
          <FormattedMessage
            id="traffic-announcement-additional-info"
            defaultMessage="Additional info"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {intl.formatMessage({
            id: `traffic-announcement-additional-info-${additionalInfo.toLowerCase()}`,
            defaultMessage: additionalInfo,
          })}
        </li>
      )}
      {oversizeLoad && (
        <li>
          <FormattedMessage
            id="traffic-announcement-oversize-load"
            defaultMessage="Special transport"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {`${oversizeLoad} `}
          {intl.formatMessage({
            id: 'traffic-announcement-oversize-load-definition',
            defaultMessage: '(W. x H. x L. in meters)',
          })}
        </li>
      )}
      {vehicleSizeLimit && (
        <li>
          <FormattedMessage
            id="traffic-announcement-vehicle-size-limit"
            defaultMessage="Vehicle limitations"
          >
            {(...content) => <span>{`${content}:`}</span>}
          </FormattedMessage>
          {`${vehicleSizeLimit} `}
          {intl.formatMessage({
            id: 'traffic-announcement-vehicle-size-limit-definition',
            defaultMessage: '(W. x H. x L. x Weight in meters and tons)',
          })}
        </li>
      )}
      {url && (
        <li className="link">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </li>
      )}
      {imageUrls &&
        imageUrls.map((imageUrl, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`image_${key}`}>
            <img
              src={imageUrl}
              alt=""
              onClick={() => {
                window.open(imageUrl, '_blank');
              }}
            />
          </li>
        ))}
    </ul>
  );
};

ExtendedContent.propTypes = {
  trafficAnnouncement: PropTypes.object.isRequired,
};

ExtendedContent.contextTypes = {
  intl: intlShape.isRequired,
};

const TrafficAnnouncementContent = (
  { trafficAnnouncement, lang, type },
  { defaultLanguage },
) => {
  const { startTime, endTime, description } = trafficAnnouncement;

  const descriptionLocal =
    description[lang] || description[defaultLanguage] || '';
  const startFormated = startTime
    ? moment(startTime).format('DD.MM.YYYY HH:mm')
    : '';
  const endFormated = endTime ? moment(endTime).format('DD.MM.YYYY HH:mm') : '';

  return (
    <div className="disorder-container">
      <div className="insident-info insident-info-announcement">
        <span className="duration">{`${startFormated} - ${endFormated}`}</span>
      </div>
      <p className="insident-message">{descriptionLocal}</p>
      {type === 'extended' && (
        <ExtendedContent trafficAnnouncement={trafficAnnouncement} />
      )}
    </div>
  );
};

TrafficAnnouncementContent.displayName = 'TrafficAnnouncementContent';

TrafficAnnouncementContent.description = (
  <div>
    <p>Renders content of a traffic announcement popup or modal</p>
    <ComponentUsageExample description="">
      <TrafficAnnouncementContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

TrafficAnnouncementContent.propTypes = {
  trafficAnnouncement: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  type: PropTypes.string,
};

TrafficAnnouncementContent.defaultProps = {
  type: '',
};

TrafficAnnouncementContent.contextTypes = {
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default connectToStores(
  TrafficAnnouncementContent,
  ['PreferencesStore'],
  context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  }),
);
