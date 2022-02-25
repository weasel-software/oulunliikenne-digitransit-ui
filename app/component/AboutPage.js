import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';

const getParagraphWithLink = (paragraph, link) => {
  if (paragraph.includes('{link}') && link) {
    const [start, end] = paragraph.split('{link}');
    return (
      <>
        {start}
        <a target="_blank" rel="noopener noreferrer" href={link.href}>
          {link.text}
        </a>
        {end}
      </>
    );
  }
  return paragraph;
};

const AboutPage = ({ currentLanguage }, context) => {
  const about = context.config.aboutThisService[currentLanguage];
  return (
    <div className="about-page fullscreen">
      <div className="page-frame fullscreen momentum-scroll">
        {about.map(
          (section, i) =>
            section.paragraphs && section.paragraphs.length ? (
              <div key={`about-section-${i}`}>
                <h1 className="about-header">{section.header}</h1>
                {section.paragraphs &&
                  section.paragraphs.map((p, j) => (
                    <p key={`about-section-${i}-p-${j}`}>
                      {getParagraphWithLink(p, section.link)}
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
};

export default connectToStores(AboutPage, ['PreferencesStore'], context => ({
  currentLanguage: context.getStore('PreferencesStore').getLanguage(),
}));
