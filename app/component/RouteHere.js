import PropTypes from 'prop-types';
import React from 'react';
import { locationShape } from 'react-router';
import { intlShape } from 'react-intl';
import get from 'lodash/get';
import { toast } from 'react-toastify';
import ComponentUsageExample from './ComponentUsageExample';

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

const RouteHere = ({ children }, { location, intl }) => {
  const handleClick = () => {
    const pathName = location.pathname || null;

    if (pathName) {
      const origin = get(window, 'location.origin');
      const pathList = pathName.split('/');
      pathList[1] = 'POS';
      const positionAwarePath = pathList.join('/');

      copyToClipboard(`${origin}${positionAwarePath}`);
      toast.success(
        intl.formatMessage({
          id: 'destination-copied',
          defaultMessage: 'Destination url copied to clipboard',
        }),
      );
    } else {
      toast.warn(
        intl.formatMessage({
          id: 'destination-needed',
          defaultMessage: 'A destination needs to be defined',
        }),
      );
    }
  };

  return (
    <React.Fragment>
      {React.Children.map(children, item => {
        const props = { ...item.props, onClick: handleClick };
        return React.cloneElement(item, props);
      })}
    </React.Fragment>
  );
};

RouteHere.displayName = 'RouteHere';

RouteHere.propTypes = {
  children: PropTypes.node.isRequired,
};

RouteHere.contextTypes = {
  location: locationShape.isRequired,
  intl: intlShape.isRequired,
};

RouteHere.description = () => (
  <div>
    <p>
      Component displaying a button that will copy route url for destination to
      clipboard.
    </p>
    <ComponentUsageExample description="">
      <RouteHere>
        <button>Get route url</button>
      </RouteHere>
    </ComponentUsageExample>
  </div>
);

export default RouteHere;
