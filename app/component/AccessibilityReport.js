import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { uniqueId } from 'lodash';
import getFormattedText from '../util/configFormatter';

const AccessibilityReport = ({ currentLanguage }, context) => {
  const accessibilityReport =
    context.config.accessibilityReport[currentLanguage];
  const { intl } = context;
  return (
    <div className="accessibility-report-page fullscreen">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'accessibility-report',
            defaultMessage: 'Accessibility report',
          })}
        </title>
      </Helmet>
      <div className="page-frame fullscreen momentum-scroll">
        {accessibilityReport &&
          accessibilityReport.map(
            section =>
              section.paragraphs &&
              section.paragraphs.length && (
                <div key={uniqueId('accessibility-report-section')}>
                  {section.header && <h2>{section.header}</h2>}
                  {section.header2 && <h3>{section.header2}</h3>}
                  {section.paragraphs &&
                    section.paragraphs.map(p => {
                      const key = uniqueId('accessibility-report-paragraph');
                      return (
                        <p key={key}>{getFormattedText(p, section.link)}</p>
                      );
                    })}
                  {section.list && (
                    <ul key={uniqueId('accessibility-report-list')}>
                      {section.list.map(li => (
                        <li key={uniqueId('accessibility-report-list-item')}>
                          {getFormattedText(li)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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

AccessibilityReport.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
};

AccessibilityReport.contextTypes = {
  config: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default connectToStores(
  AccessibilityReport,
  ['PreferencesStore'],
  context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  }),
);
