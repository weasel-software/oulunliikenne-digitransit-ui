import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { intlShape } from 'react-intl';

import Icon from './Icon';
import ErrorBoundary from './ErrorBoundary';

export default function DesktopView(
  { title, header, map, content, homeUrl, scrollable, altView },
  { intl: { formatMessage } },
) {
  return (
    <div
      className={cx('desktop', {
        'alt-view': altView,
      })}
    >
      <div className="main-content">
        <div className="desktop-title">
          <h2>
            <Link
              title={formatMessage({
                id: 'back-to-front-page',
                defaultMessage: 'Back to the front page',
              })}
              to={homeUrl}
            >
              <Icon img="icon-icon_home" className="home-icon" />
            </Link>
            <Icon
              img="icon-icon_arrow-collapse--right"
              className="arrow-icon"
            />
            {title}
          </h2>
        </div>
        <div
          className={cx('scrollable-content-wrapper', {
            'momentum-scroll': scrollable,
          })}
        >
          {header}
          <ErrorBoundary>{content}</ErrorBoundary>
        </div>
      </div>
      <div className="map-content">
        <ErrorBoundary>{map}</ErrorBoundary>
      </div>
    </div>
  );
}

DesktopView.propTypes = {
  title: PropTypes.node,
  header: PropTypes.node,
  map: PropTypes.node,
  content: PropTypes.node,
  homeUrl: PropTypes.string,
  scrollable: PropTypes.bool,
  altView: PropTypes.bool,
};

DesktopView.defaultProps = {
  scrollable: false,
  altView: false,
};

DesktopView.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};
