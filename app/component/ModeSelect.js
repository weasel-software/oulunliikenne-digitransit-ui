import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import ComponentUsageExample from './ComponentUsageExample';
import { setMode } from '../action/ModeActions';
import { isBrowser } from '../util/browser';

import Transport from 'material-ui/svg-icons/maps/directions-bus';
import Car from 'material-ui/svg-icons/maps/directions-car';
import Walk from 'material-ui/svg-icons/maps/directions-walk';
import Bicycle from 'material-ui/svg-icons/maps/directions-bike';

const selectMode = (executeAction, mode) => () =>
  executeAction(setMode, mode);

const renderIcon = (mode) => {
  switch(mode) {
    case 'transport':
      return <Transport />;
    case 'car':
      return <Car />;
    case 'walk':
      return <Walk />;
    case 'bicycle':
      return <Bicycle />;
    default:
      return null;
  }
}

const mode = (mode, currentMode, highlight, executeAction) => (
  <button
    id={`mode-${mode}`}
    key={mode}
    className={`${(highlight && 'selected') || ''} noborder mode`}
    onClick={selectMode(executeAction, mode)}
  >
    {renderIcon(mode)}
  </button>
);

const ModeSelect = ({ currentMode }, { executeAction, config }) => {
  if (isBrowser) {
    return (
      <div key="mode-select" id="mode-select">
        {config.availableModes.map(availableMode =>
          mode(
            availableMode,
            currentMode,
            availableMode === currentMode,
            executeAction,
          ),
        )}
      </div>
    );
  }
  return null;
};

ModeSelect.displayName = 'ModeSelect';

ModeSelect.description = () => (
  <div>
    <p>Mode selection component, mode selection comes from config.</p>
    <ComponentUsageExample description="">
      <div style={{ width: '200px', background: 'rgb(51, 51, 51)' }}>
        <ModeSelect />
      </div>
    </ComponentUsageExample>
  </div>
);

ModeSelect.propTypes = {
  currentMode: PropTypes.string.isRequired,
};

ModeSelect.contextTypes = {
  executeAction: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

export default connectToStores(ModeSelect, ['ModeStore'], context => ({
  currentMode: context.getStore('ModeStore').getMode(),
}));
