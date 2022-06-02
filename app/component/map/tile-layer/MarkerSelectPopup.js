import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import SelectStopRow from './SelectStopRow';
import SelectTerminalRow from './SelectTerminalRow';
import SelectCityBikeRow from './SelectCityBikeRow';
import SelectParkAndRideRow from './SelectParkAndRideRow';
import SelectTicketSalesRow from './SelectTicketSalesRow';
import SelectCameraStationRow from './SelectCameraStationRow';
import SelectDisorderRow from './SelectDisorderRow';
import SelectParkingStationRow from './SelectParkingStationRow';
import SelectRoadworkRow from './SelectRoadworkRow';
import SelectTmsStationRow from './SelectTmsStationRow';
import SelectWeatherStationRow from './SelectWeatherStationRow';
import SelectRoadConditionRow from './SelectRoadConditionRow';
import SelectFluencyRow from './SelectFluencyRow';
import SelectMaintenanceVehicleRow from './SelectMaintenanceVehicleRow';
import SelectMaintenanceVehicleRouteRow from './SelectMaintenanceVehicleRouteRow';
import SelectRoadSignRow from './SelectRoadSignRow';
import SelectBicycleRouteRow from './SelectBicycleRouteRow';
import ComponentUsageExample from '../../ComponentUsageExample';
import { options } from '../../ExampleData';
import SelectEcoCounterRow from './SelectEcoCounterRow';

function MarkerSelectPopup(props) {
  const rows = props.options.map((option, index) => {
    if (option.layer === 'stop' && option.feature.properties.stops) {
      return (
        <SelectTerminalRow
          {...option.feature.properties}
          key={option.feature.properties.gtfsId}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'stop') {
      return (
        <SelectStopRow
          {...option.feature.properties}
          key={option.feature.properties.gtfsId}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'citybike') {
      return (
        <SelectCityBikeRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'parkAndRide') {
      return (
        <SelectParkAndRideRow
          {...option.feature.properties}
          key={option.feature.properties.carParkId}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'ticketSales') {
      return (
        <SelectTicketSalesRow
          {...option.feature.properties}
          key={option.feature.properties.FID}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'cameraStations') {
      return (
        <SelectCameraStationRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'disorders') {
      return (
        <SelectDisorderRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'parkingStations') {
      return (
        <SelectParkingStationRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'roadworks') {
      return (
        <SelectRoadworkRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'tmsStations') {
      return (
        <SelectTmsStationRow
          {...option.feature.properties}
          key={`${option.feature.properties.id}_${option.layer}`}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'weatherStations') {
      return (
        <SelectWeatherStationRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'roadConditions') {
      return (
        <SelectRoadConditionRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'fluencies') {
      return (
        <SelectFluencyRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'ecoCounters') {
      return (
        <SelectEcoCounterRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'maintenanceVehicles') {
      return (
        <SelectMaintenanceVehicleRouteRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'realtimeMaintenanceVehicles') {
      return (
        <SelectMaintenanceVehicleRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer === 'roadSigns') {
      return (
        <SelectRoadSignRow
          {...option.feature.properties}
          key={option.feature.properties.id}
          selectRow={() => props.selectRow([option])}
        />
      );
    } else if (option.layer.indexOf('bicycleRoute') === 0) {
      return (
        <SelectBicycleRouteRow
          layerName={option.layer}
          {...option.feature.properties}
          key={`${option.feature.properties.type}-${index}`} // eslint-disable-line react/no-array-index-key
          selectRow={() => props.selectRow([option])}
        />
      );
    }
    return null;
  });

  return (
    <div className="card marker-select-popup">
      <h4 className="padding-normal gray">
        <FormattedMessage id="choose-stop" defaultMessage="Choose stop" />
      </h4>
      <hr className="no-margin gray" />
      <div className="scrollable momentum-scroll card-row">{rows}</div>
    </div>
  );
}

MarkerSelectPopup.displayName = 'MarkerSelectPopup';

MarkerSelectPopup.description = (
  <div>
    <p>Renders a marker select popup</p>
    <ComponentUsageExample description="">
      <MarkerSelectPopup options={options} selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

MarkerSelectPopup.propTypes = {
  options: PropTypes.array.isRequired,
  selectRow: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default MarkerSelectPopup;
