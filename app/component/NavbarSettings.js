import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import ComponentUsageExample from './ComponentUsageExample';
import { toggleItem } from '../action/NavbarSettingsActions';

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import Icon from './Icon';
import Checked from 'material-ui/svg-icons/toggle/radio-button-checked';
import Unchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

class NavbarSettings extends React.Component {
  constructor(props, context) {
    super(props);

    if (!context.config.navbarSettings) {
      return null;
    }

    this.state = {
      open: false,
    };
  }

  handleClick = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleItemClick = (item) => {
    const { executeAction } = this.context;
    executeAction(toggleItem, item);
  };

  render() {
    const { intl, config: { navbarSettings: configNavbarSettings } } = this.context;
    const { navbarSettings: storeNavbarSettings } = this.props;

    return (
      <div>
        <button
          className="navi-button"
          onClick={this.handleClick}
          aria-label={intl.formatMessage({
            id: 'settings',
            defaultMessage: 'Settings',
          })}
        >
          <FormattedMessage id="settings" defaultMessage="Settings" />
          <Icon img="icon-icon_settings" />
        </button>
        <Popover
          className="navbar-settings"
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <div className="navbar-settings_inner">
            <h2>
              {intl.formatMessage({
                id: 'motorist',
                defaultMessage: 'Motorist',
              })}
            </h2>
            {configNavbarSettings.hasOwnProperty('disruptions') && <Toggle
              label={intl.formatMessage({
                  id: 'disruptions',
                  defaultMessage: 'Disruptions',
                })}
              toggled={(storeNavbarSettings.disruptions || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('disruptions')}
            />}
            {configNavbarSettings.hasOwnProperty('roadworks') && <Toggle
              label={intl.formatMessage({
                  id: 'roadworks',
                  defaultMessage: 'Roadworks',
                })}
              toggled={(storeNavbarSettings.roadworks || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('roadworks')}
            />}
            {configNavbarSettings.hasOwnProperty('parking') && <Toggle
              label={intl.formatMessage({
                  id: 'parking',
                  defaultMessage: 'Parking',
                })}
              toggled={(storeNavbarSettings.parking || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('parking')}
            />}
            {configNavbarSettings.hasOwnProperty('cameras') && <Toggle
              label={intl.formatMessage({
                  id: 'cameras',
                  defaultMessage: 'Cameras',
                })}
              toggled={(storeNavbarSettings.cameras || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('cameras')}
            />}
            {configNavbarSettings.hasOwnProperty('weatherStations') && <Toggle
              label={intl.formatMessage({
                  id: 'weather-stations',
                  defaultMessage: 'Weather stations',
                })}
              toggled={(storeNavbarSettings.weatherStations || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('weatherStations')}
            />}
            {configNavbarSettings.hasOwnProperty('tmsStations') && <Toggle
              label={intl.formatMessage({
                  id: 'traffic-monitoring',
                  defaultMessage: 'Traffic monitoring',
                })}
              toggled={(storeNavbarSettings.tmsStations || false)}
              className="toggle-item"
              onClick={() => this.handleItemClick('tmsStations')}
            />}
          </div>
          {/*<div className="navbar-settings_subset">
            <Toggle
              label={intl.formatMessage({
                  id: 'road-info',
                  defaultMessage: 'Road information',
                })}
              defaultToggled={true}
              className="toggle-item"
            />
            <Checkbox
              checkedIcon={<Checked />}
              uncheckedIcon={<Unchecked />}
              label={intl.formatMessage({
                  id: 'traffic-info',
                  defaultMessage: 'Traffic information',
                })}
              checked={true}
              onCheck={() => alert('Change')}
              className="toggle-item-dense"
            />
            <Checkbox
              checkedIcon={<Checked />}
              uncheckedIcon={<Unchecked />}
              label={intl.formatMessage({
                  id: 'driving-conditions',
                  defaultMessage: 'Driving conditions',
                })}
              checked={false}
              onCheck={() => alert('Change')}
              className="toggle-item-dense"
            />
            <Checkbox
              checkedIcon={<Checked />}
              uncheckedIcon={<Unchecked />}
              label={intl.formatMessage({
                  id: 'maintenance',
                  defaultMessage: 'Maintenance',
                })}
              checked={false}
              onCheck={() => alert('Change')}
              className="toggle-item-dense"
            />
          </div>*/}
        </Popover>
      </div>
    );
  }
};

NavbarSettings.propTypes = {
  navbarSettings: PropTypes.object.isRequired,
};

NavbarSettings.contextTypes = {
  intl: intlShape.isRequired,
  config: PropTypes.object.isRequired,
  executeAction: PropTypes.func.isRequired,
};

NavbarSettings.description = () => (
  <div>
    <p>
      Popover that shows available settings.
    </p>
    <ComponentUsageExample>
      <NavbarSettings />
    </ComponentUsageExample>
  </div>
);

export default connectToStores(NavbarSettings, ['NavbarSettingsStore'], context => ({
  navbarSettings: context.getStore('NavbarSettingsStore').getNavbarSettings(),
}));
