import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getFormattedText from '../util/configFormatter';

const AboutPage = ({ currentLanguage }, context) => {
  const about = context.config.aboutThisService[currentLanguage];
  const { intl } = context;
  return (
    <div className="about-page fullscreen">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'about-this-service',
            defaultMessage: 'About',
          })}
        </title>
      </Helmet>
      <div className="page-frame fullscreen momentum-scroll">
        {about.map(
          (section, i) =>
            section.paragraphs && section.paragraphs.length ? (
              <div key={`about-section-${i}`}>
                <h2 className="about-header">{section.header}</h2>
                {section.paragraphs &&
                  section.paragraphs.map((p, j) => (
                    <p key={`about-section-${i}-p-${j}`}>
                      {getFormattedText(p, section.link)}
                    </p>
                  ))}
              </div>
            ) : (
              false
            ),
        )}
        <Link to="/">
          <div className="call-to-action-button">
            <FormattedMessage
              id="back-to-front-page"
              defaultMessage="Back to front page"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

AboutPage.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
};

AboutPage.contextTypes = {
  config: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default connectToStores(AboutPage, ['PreferencesStore'], context => ({
  currentLanguage: context.getStore('PreferencesStore').getLanguage(),
}));
