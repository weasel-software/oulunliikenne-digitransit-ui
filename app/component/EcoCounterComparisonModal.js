import React from 'react';
import { routerShape, locationShape } from 'react-router';
import Modal from './Modal';
import EcoCounterPopup from './map/popups/EcoCounterPopup';

const EcoCounterComparisonModal = (props, { router, location }) => {
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
      title="Vertailu"
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
};

export default EcoCounterComparisonModal;
