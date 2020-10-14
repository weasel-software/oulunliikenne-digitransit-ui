import React from 'react';
import { routerShape, locationShape } from 'react-router';
import { intlShape } from 'react-intl';
import Modal from './Modal';
import EcoCounterPopup from './map/popups/EcoCounterPopup';

const EcoCounterComparisonModal = (props, { router, location, intl }) => {
  const isOpen = location.state
    ? location.state.ecoCounterComparisonOpen
    : false;

  const toggleModal = () => {
    router.goBack();
  };

  return (
    <Modal
      className="EcoCounterModal"
      open={isOpen}
      title={intl.formatMessage({ id: 'compare' })}
      toggleVisibility={toggleModal}
    >
      {isOpen && (
        <EcoCounterPopup isComparison {...location.state.ecoCounterProps} />
      )}
    </Modal>
  );
};

EcoCounterComparisonModal.contextTypes = {
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  intl: intlShape.isRequired,
};

export default EcoCounterComparisonModal;
