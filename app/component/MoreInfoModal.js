import PropTypes from 'prop-types';
import React from 'react';
import { routerShape, locationShape } from 'react-router';
import Modal from './Modal';
import ComponentUsageExample from './ComponentUsageExample';
import { isBrowser } from '../util/browser';

function MoreInfoModal(props, { router, location }) {
  if (!((props && props.isBrowser) || isBrowser)) {
    return null;
  }

  const isOpen = () =>
    location.state ? location.state.moreInfoModalOpen : false;
  if (!isOpen()) {
    return null;
  }

  const toggleVisibility = () => {
    if (isOpen()) {
      router.goBack();
    } else {
      router.push({
        ...location,
        state: {
          ...location.state,
          moreInfoModalOpen: true,
        },
      });
    }
  };

  return (
    <Modal
      open
      title={location.state.moreInfoModalTitle}
      toggleVisibility={toggleVisibility}
    >
      <div className="insident-modal">
        {location.state.moreInfoModalContent}
      </div>
    </Modal>
  );
}

MoreInfoModal.contextTypes = {
  router: routerShape.isRequired, // eslint-disable-line react/no-typos
  location: locationShape.isRequired, // eslint-disable-line react/no-typos
};

MoreInfoModal.propTypes = {
  isBrowser: PropTypes.bool,
};

MoreInfoModal.defaultProps = {
  isBrowser: false,
};

MoreInfoModal.description = () => (
  <div>
    <p>
      Modal that shows more info about a specific roadwork.
    </p>
    <ComponentUsageExample>
      <MoreInfoModal />
    </ComponentUsageExample>
  </div>
);

export default MoreInfoModal;
