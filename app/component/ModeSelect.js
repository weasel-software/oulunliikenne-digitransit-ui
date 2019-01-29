import PropTypes from 'prop-types';
import React from 'react';
import ComponentUsageExample from './ComponentUsageExample';
import ToggleButton from './ToggleButton';
import { isKeyboardSelectionEvent, isBrowser } from '../util/browser';
import { updateMapLayersMode } from '../action/MapLayerActions';

class ModeSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStreetMode:
        this.props.selectedStreetMode ||
        this.props.streetModeConfigs.find(c => c.defaultValue).name,
    };
  }

  getButtons() {
    const { streetModeConfigs } = this.props;
    const { selectedStreetMode } = this.state;

    if (!streetModeConfigs.length) {
      return null;
    }

    return streetModeConfigs.map(streetMode => {
      const { exclusive, icon, name } = streetMode;
      const isSelected = name === selectedStreetMode;
      const labelId = `street-mode-${name.toLowerCase()}`;
      return (
        <ToggleButton
          buttonRef={ref => {
            if (ref && isSelected) {
              this.selectedStreetModeButton = ref;
            }
          }}
          className="mode"
          checkedClass="selected"
          icon={icon}
          key={name}
          label={labelId}
          onBtnClick={() => this.selectMode(name, exclusive)}
          onKeyDown={e =>
            isKeyboardSelectionEvent(e) &&
            this.selectMode(name, exclusive, true)
          }
          showButtonTitle={false}
          state={isSelected}
        />
      );
    });
  }

  selectMode(streetMode, isExclusive, applyFocus = false) {
    this.setState(
      {
        selectedStreetMode: streetMode,
      },
      () => {
        this.props.selectStreetMode(streetMode.toUpperCase(), isExclusive);
        if (applyFocus && this.dialogRef) {
          this.dialogRef.closeDialog(applyFocus);
        }

        this.context.executeAction(updateMapLayersMode, streetMode);
      },
    );
  }

  render() {
    if (isBrowser) {
      return <div id="mode-select">{this.getButtons()}</div>;
    }
    return null;
  }
}

ModeSelect.displayName = 'ModeSelect';

ModeSelect.description = () => (
  <div>
    <p>Mode selection component, mode selection comes from config.</p>
    <ComponentUsageExample description="">
      <div style={{ width: '200px', background: 'rgb(51, 51, 51)' }}>
        <ModeSelect
          selectStreetMode={() => {}}
          streetModeConfigs={[
            {
              defaultValue: true,
              icon: 'public_transport',
              name: 'PUBLIC_TRANSPORT',
            },
            {
              defaultValue: false,
              icon: 'walk',
              name: 'WALK',
            },
            {
              defaultValue: false,
              icon: 'biking',
              name: 'BICYCLE',
            },
            {
              defaultValue: false,
              icon: 'car-withoutBox',
              name: 'CAR_PARK',
            },
          ]}
        />
      </div>
    </ComponentUsageExample>
  </div>
);

ModeSelect.propTypes = {
  selectStreetMode: PropTypes.func.isRequired,
  selectedStreetMode: PropTypes.string,
  streetModeConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      defaultValue: PropTypes.bool.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

ModeSelect.defaultProps = {
  selectedStreetMode: undefined,
  streetModeConfigs: [],
};

ModeSelect.contextTypes = {
  executeAction: PropTypes.func.isRequired,
};

export default ModeSelect;
