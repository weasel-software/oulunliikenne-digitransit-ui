import connectToStores from 'fluxible-addons-react/connectToStores';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { locationShape } from 'react-router';
import get from 'lodash/get';
import classNames from 'classnames';
import Toggle from 'material-ui/Toggle';
import BubbleDialog from './BubbleDialog';
import Checkbox from './Checkbox';
import {
  clearMapLayers,
  updateMapLayers,
  updateMapLayersMode,
} from '../action/MapLayerActions';
import { updateMapLayerOptions } from '../action/MapLayerOptionsActions';
import MapLayerStore, { mapLayerShape } from '../store/MapLayerStore';
import MapLayerOptionsStore, {
  mapLayerOptionsShape,
} from '../store/MapLayerOptionsStore';
import withBreakpoint from '../util/withBreakpoint';
import { getStreetMode } from '../util/modeUtils';

import ComponentUsageExample from './ComponentUsageExample';

function InputField(props, { config, intl }) {
  if (config.mapTrackingButtons && config.mapTrackingButtons.altPosition) {
    return (
      <Toggle
        label={intl.formatMessage({
          id: props.labelId,
          defaultMessage: props.defaultMessage,
        })}
        toggled={props.checked}
        className="toggle-item"
        onClick={props.onChange}
        rippleStyle={!props.checked ? { color: 'black' } : { opacity: 0.5 }}
      />
    );
  }

  return (
    <Checkbox
      checked={props.checked}
      labelId={props.labelId}
      defaultMessage={props.defaultMessage}
      onChange={props.onChange}
    />
  );
}

InputField.propTypes = {
  checked: PropTypes.bool.isRequired,
  labelId: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

InputField.contextTypes = {
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

class SelectMapLayersDialog extends React.Component {
  componentDidMount = () => {
    const { config, location } = this.props;
    const streetMode = getStreetMode(location, config);
    this.props.executeAction(updateMapLayersMode, streetMode);
  };

  getHeaderId = () => {
    const { config, location } = this.props;
    const streetMode = getStreetMode(location, config);
    const headerId =
      get(config, 'mapTrackingButtons.layers.streetModeHeader', false) &&
      streetMode
        ? `street-mode-${streetMode.toLowerCase()}`
        : get(
            config,
            'mapTrackingButtons.layers.headerId',
            'select-map-layers-header',
          );
    return headerId;
  };

  updateSetting = newSetting => {
    this.props.updateMapLayers({
      ...this.props.mapLayers,
      ...newSetting,
    });
  };

  updateMapLayerOptions = newOptions => {
    this.props.updateMapLayerOptions({
      ...this.props.mapLayerOptions,
      ...newOptions,
    });
  };

  updateTimeRangeSelection = timeRangeMinutes => {
    const timeRange = Number(timeRangeMinutes);
    // 30 day timerange available only for brushing categories
    // currently does not display other maintenance categories
    // simultaneously with brushing
    const brushingFor30days = timeRange === 43200;
    const newOptions = {
      ...this.props.mapLayerOptions.maintenanceVehicles,
      brushingFor30days,
      timeRange,
    };
    this.props.updateMapLayerOptions({
      ...this.props.mapLayerOptions,
      maintenanceVehicles: {
        ...newOptions,
      },
    });
  };

  updateStopAndTerminalSetting = newSetting => {
    const { mapLayers } = this.props;
    const stop = {
      ...mapLayers.stop,
      ...newSetting,
    };
    const terminal = {
      ...mapLayers.terminal,
      ...newSetting,
    };
    this.updateSetting({ stop, terminal });
  };

  updateStopSetting = newSetting => {
    const stop = {
      ...this.props.mapLayers.stop,
      ...newSetting,
    };
    this.updateSetting({ stop });
  };

  updateTerminalSetting = newSetting => {
    const terminal = {
      ...this.props.mapLayers.terminal,
      ...newSetting,
    };
    this.updateSetting({ terminal });
  };

  updateTicketSalesSetting = newSetting => {
    const ticketSales = {
      ...this.props.mapLayers.ticketSales,
      ...newSetting,
    };
    this.updateSetting({ ticketSales });
  };

  updateBicycleRoutesSetting = newSetting => {
    const bicycleRoutes = {
      ...this.props.mapLayers.bicycleRoutes,
      ...newSetting,
    };
    this.updateSetting({ bicycleRoutes });
  };

  getToggleButtonTitle = headerId => {
    const { intl, getStore } = this.context;
    const language = getStore('PreferencesStore').getLanguage();

    const start = intl.formatMessage({
      id: headerId,
      defaultMessage: '',
    });

    let end = intl
      .formatMessage({
        id: 'settings',
        defaultMessage: 'settings',
      })
      .toLowerCase();

    // Finnish grammar policing
    if (language === 'fi' && start.includes(' ')) {
      end = ` -${end}`;
    } else if (language === 'fi' && start.endsWith(end.charAt(0))) {
      end = `-${end}`;
    } else if (language !== 'fi') {
      end = ` ${end}`;
    }
    return start + end;
  };

  renderContents = () => {
    const {
      citybike,
      parkAndRide,
      stop,
      terminal,
      ticketSales,
      parkingStations,
      disorders,
      roadworks,
      cameraStations,
      weatherStations,
      tmsStations,
      roadConditions,
      fluencies,
      ecoCounters,
      maintenanceVehicles,
      realtimeMaintenanceVehicles,
      roadInspectionVehicles,
      roadSigns,
      bicycleRoutes,
      bicycleRoutesMainRegional,
      bicycleRoutesBaana,
      bicycleRoutesBrand,
    } = this.props.mapLayers;
    const { config, mapLayerOptions } = this.props;

    const isTransportModeEnabled = transportMode =>
      transportMode && transportMode.availableForSelection;
    const transportModes = config.transportModes || {};

    const isMapLayerEnabled = mapLayer =>
      get(this.props.mapLayers, mapLayer, null) !== null;

    return (
      <React.Fragment>
        <div className="checkbox-grouping">
          {isTransportModeEnabled(transportModes.bus) && (
            <React.Fragment>
              {isMapLayerEnabled('stop.bus') && (
                <InputField
                  checked={stop.bus}
                  labelId="map-layer-stop-bus"
                  defaultMessage="Bus stop"
                  onChange={e =>
                    this.updateStopSetting({ bus: e.target.checked })
                  }
                />
              )}
              {isMapLayerEnabled('terminal.bus') && (
                <InputField
                  checked={terminal.bus}
                  labelId="map-layer-terminal-bus"
                  defaultMessage="Bus terminal"
                  onChange={e =>
                    this.updateTerminalSetting({ bus: e.target.checked })
                  }
                />
              )}
            </React.Fragment>
          )}
          {isTransportModeEnabled(transportModes.tram) &&
            isMapLayerEnabled('stop.tram') && (
              <InputField
                checked={stop.tram}
                labelId="map-layer-stop-tram"
                defaultMessage="Tram stop"
                onChange={e =>
                  this.updateStopSetting({ tram: e.target.checked })
                }
              />
            )}
          {isTransportModeEnabled(transportModes.rail) &&
            isMapLayerEnabled('terminal.rail') && (
              <InputField
                checked={terminal.rail}
                labelId="map-layer-terminal-rail"
                defaultMessage="Railway station"
                onChange={e =>
                  this.updateStopAndTerminalSetting({ rail: e.target.checked })
                }
              />
            )}
          {isTransportModeEnabled(transportModes.subway) &&
            isMapLayerEnabled('terminal.subway') && (
              <InputField
                checked={terminal.subway}
                labelId="map-layer-terminal-subway"
                defaultMessage="Subway station"
                onChange={e =>
                  this.updateStopAndTerminalSetting({
                    subway: e.target.checked,
                  })
                }
              />
            )}
          {isTransportModeEnabled(transportModes.ferry) &&
            isMapLayerEnabled('stop.ferry') && (
              <InputField
                checked={stop.ferry}
                labelId="map-layer-stop-ferry"
                defaultMessage="Ferries"
                onChange={e =>
                  this.updateStopSetting({ ferry: e.target.checked })
                }
              />
            )}
          {config.cityBike &&
            config.cityBike.showCityBikes &&
            isMapLayerEnabled('citybike') && (
              <InputField
                checked={citybike}
                labelId="map-layer-citybike"
                defaultMessage="Citybike station"
                onChange={e =>
                  this.updateSetting({ citybike: e.target.checked })
                }
              />
            )}
          {config.parkAndRide &&
            config.parkAndRide.showParkAndRide &&
            isMapLayerEnabled('parkAndRide') && (
              <InputField
                checked={parkAndRide}
                labelId="map-layer-park-and-ride"
                defaultMessage="Park &amp; ride"
                onChange={e =>
                  this.updateSetting({ parkAndRide: e.target.checked })
                }
              />
            )}
          {config.parkingStations &&
            config.parkingStations.showParkingStations &&
            isMapLayerEnabled('parkingStations') && (
              <InputField
                checked={parkingStations}
                labelId="parking"
                defaultMessage="Parking"
                onChange={e =>
                  this.updateSetting({ parkingStations: e.target.checked })
                }
              />
            )}
          {config.fluencies &&
            config.fluencies.showFluencies &&
            isMapLayerEnabled('fluencies') && (
              <InputField
                checked={fluencies}
                labelId="fluency"
                defaultMessage="Fluency"
                onChange={e =>
                  this.updateSetting({ fluencies: e.target.checked })
                }
              />
            )}
          {config.roadworks &&
            config.roadworks.showRoadworks &&
            isMapLayerEnabled('roadworks') && (
              <InputField
                checked={roadworks}
                labelId="roadworks"
                defaultMessage="Roadworks"
                onChange={e =>
                  this.updateSetting({ roadworks: e.target.checked })
                }
              />
            )}
          {config.disorders &&
            config.disorders.showDisorders &&
            isMapLayerEnabled('disorders') && (
              <InputField
                checked={disorders}
                labelId="disruptions"
                defaultMessage="Disruptions"
                onChange={e =>
                  this.updateSetting({ disorders: e.target.checked })
                }
              />
            )}
          {config.roadSigns &&
            config.roadSigns.showRoadSigns &&
            isMapLayerEnabled('roadSigns') && (
              <InputField
                checked={roadSigns}
                labelId="road-signs"
                defaultMessage="Road signs"
                onChange={e =>
                  this.updateSetting({ roadSigns: e.target.checked })
                }
              />
            )}
          {config.tmsStations &&
            config.tmsStations.showTmsStations &&
            isMapLayerEnabled('tmsStations') && (
              <InputField
                checked={tmsStations}
                labelId="traffic-monitoring"
                defaultMessage="Traffic monitoring"
                onChange={e =>
                  this.updateSetting({ tmsStations: e.target.checked })
                }
              />
            )}
          {config.ecoCounters &&
            config.ecoCounters.showEcoCounters &&
            isMapLayerEnabled('ecoCounters') && (
              <InputField
                checked={ecoCounters}
                labelId="eco-counter"
                defaultMessage="Eco Counters"
                onChange={e =>
                  this.updateSetting({ ecoCounters: e.target.checked })
                }
              />
            )}
          {config.cameraStations &&
            config.cameraStations.showCameraStations &&
            isMapLayerEnabled('cameraStations') && (
              <InputField
                checked={cameraStations}
                labelId="cameras"
                defaultMessage="Cameras"
                onChange={e =>
                  this.updateSetting({ cameraStations: e.target.checked })
                }
              />
            )}
          {config.weatherStations &&
            config.weatherStations.showWeatherStations &&
            isMapLayerEnabled('weatherStations') && (
              <InputField
                checked={weatherStations}
                labelId="weather-stations"
                defaultMessage="Weather stations"
                onChange={e =>
                  this.updateSetting({ weatherStations: e.target.checked })
                }
              />
            )}
          {config.roadConditions &&
            config.roadConditions.showRoadConditions &&
            isMapLayerEnabled('roadConditions') && (
              <InputField
                checked={roadConditions}
                labelId="road-condition"
                defaultMessage="Road condition"
                onChange={e =>
                  this.updateSetting({ roadConditions: e.target.checked })
                }
              />
            )}
        </div>
        {config.ticketSales &&
          config.ticketSales.showTicketSales &&
          (isMapLayerEnabled('ticketSales.ticketMachine') ||
            isMapLayerEnabled('ticketSales.salesPoint')) && (
            <div className="checkbox-grouping">
              {isMapLayerEnabled('ticketSales.ticketMachine') && (
                <InputField
                  checked={ticketSales.ticketMachine}
                  labelId="map-layer-ticket-sales-machine"
                  defaultMessage="Ticket machine"
                  onChange={e =>
                    this.updateTicketSalesSetting({
                      ticketMachine: e.target.checked,
                    })
                  }
                />
              )}
              {isMapLayerEnabled('ticketSales.salesPoint') && (
                <InputField
                  checked={ticketSales.salesPoint}
                  labelId="map-layer-ticket-sales-point"
                  defaultMessage="Travel Card top up"
                  onChange={e =>
                    this.updateTicketSalesSetting({
                      salesPoint: e.target.checked,
                      servicePoint: e.target.checked,
                    })
                  }
                />
              )}
            </div>
          )}
        {config.maintenanceVehicles &&
          config.maintenanceVehicles.showMaintenanceVehicles &&
          isMapLayerEnabled('maintenanceVehicles') && (
            <React.Fragment>
              <InputField
                checked={maintenanceVehicles}
                labelId="maintenance"
                defaultMessage="Maintenance"
                onChange={e =>
                  this.updateSetting({
                    maintenanceVehicles: e.target.checked,
                    roadInspectionVehicles: false,
                  })
                }
              />
              {maintenanceVehicles &&
                config.realtimeMaintenanceVehicles &&
                config.realtimeMaintenanceVehicles
                  .showRealtimeMaintenanceVehicles &&
                isMapLayerEnabled('realtimeMaintenanceVehicles') && (
                  <div className="maintenance-vehicles-container">
                    <div className="maintenance-vehicles-time-range">
                      <p className="maintenance-vehicles-time-range-label">
                        <FormattedMessage id="maintenance-vehicle-time-range" />
                      </p>
                      <ul className="maintenance-vehicles-time-range-buttons">
                        {Object.keys(config.maintenanceVehicles.timeRanges).map(
                          timeRangeMinutes => {
                            const isActive =
                              get(
                                mapLayerOptions,
                                'maintenanceVehicles.timeRange',
                                null,
                              ) === Number(timeRangeMinutes);

                            return (
                              <li key={timeRangeMinutes}>
                                <button
                                  className={classNames(
                                    'standalone-btn maintenance-vehicles-time-range-btn',
                                    {
                                      'maintenance-vehicles-time-range-btn--active': isActive,
                                    },
                                  )}
                                  onClick={() =>
                                    this.updateTimeRangeSelection(
                                      timeRangeMinutes,
                                    )
                                  }
                                >
                                  <FormattedMessage
                                    id={
                                      config.maintenanceVehicles.timeRanges[
                                        timeRangeMinutes
                                      ]
                                    }
                                  />
                                </button>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </div>
                    <InputField
                      checked={realtimeMaintenanceVehicles}
                      labelId="realtime-maintenance-vehicles"
                      defaultMessage="Realtime maintenance vehicles"
                      onChange={e =>
                        this.updateSetting({
                          realtimeMaintenanceVehicles: e.target.checked,
                        })
                      }
                    />
                  </div>
                )}
            </React.Fragment>
          )}
        {config.roadInspectionVehicles &&
          config.roadInspectionVehicles.showRoadInspectionVehicles &&
          isMapLayerEnabled('roadInspectionVehicles') && (
            <React.Fragment>
              <InputField
                checked={roadInspectionVehicles}
                labelId="roadinspection"
                defaultMessage="Road inspection"
                onChange={e =>
                  this.updateSetting({
                    roadInspectionVehicles: e.target.checked,
                    maintenanceVehicles: false,
                    realtimeMaintenanceVehicles: false,
                  })
                }
              />
              {roadInspectionVehicles &&
                config.realtimeMaintenanceVehicles &&
                config.realtimeMaintenanceVehicles
                  .showRealtimeMaintenanceVehicles &&
                isMapLayerEnabled('realtimeMaintenanceVehicles') && (
                  <div className="roadinspection-vehicles-container">
                    <div className="roadinspection-vehicles-time-range">
                      <p className="roadinspection-vehicles-time-range-label">
                        <FormattedMessage id="roadinspection-vehicle-time-range" />
                      </p>
                    </div>
                    <InputField
                      checked={realtimeMaintenanceVehicles}
                      labelId="realtime-roadinspection-vehicles"
                      defaultMessage="Realtime road inspection vehicles"
                      onChange={e =>
                        this.updateSetting({
                          realtimeMaintenanceVehicles: e.target.checked,
                        })
                      }
                    />
                  </div>
                )}
            </React.Fragment>
          )}
        {config.bicycleRoutes &&
          config.bicycleRoutes.showBicycleRoutes &&
          isMapLayerEnabled('bicycleRoutes') && (
            <React.Fragment>
              <InputField
                checked={bicycleRoutes}
                labelId="bicycle-routes"
                defaultMessage="Bicycle routes"
                onChange={e =>
                  this.updateSetting({ bicycleRoutes: e.target.checked })
                }
              />
              {bicycleRoutes && (
                <div className="bicycle-routes-container">
                  {isMapLayerEnabled('bicycleRoutesBaana') && (
                    <InputField
                      checked={bicycleRoutesBaana}
                      labelId="bicycle-routes-BAANA"
                      defaultMessage="Baanat"
                      onChange={e =>
                        this.updateSetting({
                          bicycleRoutesBaana: e.target.checked,
                        })
                      }
                    />
                  )}
                  {isMapLayerEnabled('bicycleRoutesBrand') && (
                    <InputField
                      checked={bicycleRoutesBrand}
                      labelId="bicycle-routes-BRAND"
                      defaultMessage="Brand routes"
                      onChange={e =>
                        this.updateSetting({
                          bicycleRoutesBrand: e.target.checked,
                        })
                      }
                    />
                  )}
                  {isMapLayerEnabled('bicycleRoutesMainRegional') && (
                    <InputField
                      checked={bicycleRoutesMainRegional}
                      labelId="bicycle-routes-MAIN_REGIONAL"
                      defaultMessage="Main and regional routes"
                      onChange={e =>
                        this.updateSetting({
                          bicycleRoutesMainRegional: e.target.checked,
                        })
                      }
                    />
                  )}
                  {/* Bicycle route types currently not needed.
                  Commented out instead of deleted in case
                  we need to re-enable them in the future. */}
                  {/* {isMapLayerEnabled('bicycleRouteTypes') && (
                    <InputField
                      checked={bicycleRouteTypes}
                      labelId="bicycle-routes-TYPES"
                      defaultMessage="Route types"
                      onChange={e =>
                        this.updateSetting({
                          bicycleRouteTypes: e.target.checked,
                        })
                      }
                    />
                  )} */}
                </div>
              )}
            </React.Fragment>
          )}
        <button
          className="standalone-btn dialog-clear-button"
          onClick={this.props.clearMapLayers}
        >
          <FormattedMessage
            id="clear-selected-options"
            defaultMessage="Clear options"
          />
        </button>
      </React.Fragment>
    );
  };

  render() {
    const { config, breakpoint } = this.props;
    const headerId = this.getHeaderId();
    const toggleButtonTitle = this.getToggleButtonTitle(headerId);

    return (
      <BubbleDialog
        containerClassName={get(
          config,
          'mapTrackingButtons.layers.containerClassName',
          undefined,
        )}
        contentClassName="select-map-layers-dialog-content"
        header={headerId}
        id="mapLayerSelector"
        icon={get(config, 'mapTrackingButtons.layers.icon', 'map-layers')}
        buttonText={
          breakpoint !== 'large'
            ? null
            : get(config, 'mapTrackingButtons.layers.buttonText', undefined)
        }
        isOpen={this.props.isOpen}
        isFullscreenOnMobile
        toggleButtonTitle={toggleButtonTitle}
      >
        {this.renderContents()}
      </BubbleDialog>
    );
  }
}

const transportModeConfigShape = PropTypes.shape({
  availableForSelection: PropTypes.bool,
});

const mapLayersConfigShape = PropTypes.shape({
  cityBike: PropTypes.shape({
    showCityBikes: PropTypes.bool,
  }),
  parkAndRide: PropTypes.shape({
    showParkAndRide: PropTypes.bool,
  }),
  tmsStations: PropTypes.shape({
    showTmsStations: PropTypes.bool,
  }),
  weatherStations: PropTypes.shape({
    showWeatherStations: PropTypes.bool,
  }),
  parkingStations: PropTypes.shape({
    showParkingStations: PropTypes.bool,
  }),
  cameraStations: PropTypes.shape({
    showCameraStations: PropTypes.bool,
  }),
  roadworks: PropTypes.shape({
    showRoadworks: PropTypes.bool,
  }),
  disorders: PropTypes.shape({
    showDisorders: PropTypes.bool,
  }),
  roadConditions: PropTypes.shape({
    showRoadConditions: PropTypes.bool,
  }),
  fluencies: PropTypes.shape({
    showFluencies: PropTypes.bool,
  }),
  ticketSales: PropTypes.shape({
    showTicketSales: PropTypes.bool,
  }),
  maintenanceVehicles: PropTypes.shape({
    showMaintenanceVehicles: PropTypes.bool,
  }),
  roadInspectionVehicles: PropTypes.shape({
    showRoadInspectionVehicles: PropTypes.bool,
  }),
  bicycleRoutes: PropTypes.shape({
    showBicycleRoutes: PropTypes.bool,
  }),
  transportModes: PropTypes.shape({
    bus: transportModeConfigShape,
    citybike: transportModeConfigShape,
    ferry: transportModeConfigShape,
    rail: transportModeConfigShape,
    subway: transportModeConfigShape,
    tram: transportModeConfigShape,
  }),
});

SelectMapLayersDialog.propTypes = {
  config: mapLayersConfigShape,
  location: locationShape,
  isOpen: PropTypes.bool,
  mapLayers: mapLayerShape.isRequired,
  mapLayerOptions: mapLayerOptionsShape.isRequired,
  updateMapLayers: PropTypes.func.isRequired,
  updateMapLayerOptions: PropTypes.func.isRequired,
  clearMapLayers: PropTypes.func.isRequired,
  breakpoint: PropTypes.string,
  executeAction: PropTypes.func,
};

SelectMapLayersDialog.contextTypes = {
  intl: intlShape.isRequired,
  getStore: PropTypes.func.isRequired,
};

SelectMapLayersDialog.defaultProps = {
  config: {},
  location: null,
  isOpen: false,
  breakpoint: 'large',
  executeAction: null,
};

SelectMapLayersDialog.description = (
  <ComponentUsageExample isFullscreen>
    <div style={{ bottom: 0, left: 0, position: 'absolute' }}>
      <SelectMapLayersDialog
        config={{
          parkAndRide: {
            showParkAndRide: true,
          },
          ticketSales: {
            showTicketSales: true,
          },
          transportModes: {
            bus: {
              availableForSelection: true,
            },
            ferry: {
              availableForSelection: true,
            },
            rail: {
              availableForSelection: true,
            },
            subway: {
              availableForSelection: true,
            },
            tram: {
              availableForSelection: true,
            },
          },
        }}
        isOpen
        mapLayers={{
          stop: { bus: true },
          terminal: { subway: true },
          ticketSales: { ticketMachine: true },
        }}
        mapLayerOptions={{
          maintenanceVehicles: {
            timeRange: 1440,
          },
        }}
        updateMapLayers={() => {}}
        clearMapLayers={() => {}}
        updateMapLayerOptions={() => {}}
      />
    </div>
  </ComponentUsageExample>
);

const SelectMapLayersDialogWithBreakpoint = withBreakpoint(
  SelectMapLayersDialog,
);

const connectedComponent = connectToStores(
  SelectMapLayersDialogWithBreakpoint,
  [MapLayerStore, MapLayerOptionsStore],
  context => ({
    config: context.config,
    location: context.location,
    mapLayers: context.getStore(MapLayerStore).getMapLayers(),
    updateMapLayers: mapLayers =>
      context.executeAction(updateMapLayers, { ...mapLayers }),
    clearMapLayers: () => context.executeAction(clearMapLayers),
    mapLayerOptions: context
      .getStore(MapLayerOptionsStore)
      .getMapLayerOptions(),
    updateMapLayerOptions: mapLayerOptions =>
      context.executeAction(updateMapLayerOptions, { ...mapLayerOptions }),
    executeAction: context.executeAction,
  }),
  {
    config: mapLayersConfigShape,
    location: locationShape,
    executeAction: PropTypes.func,
  },
);

export { connectedComponent as default, SelectMapLayersDialog as Component };
