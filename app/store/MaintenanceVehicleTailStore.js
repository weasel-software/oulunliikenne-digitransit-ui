import Store from 'fluxible/addons/BaseStore';
import PropTypes from 'prop-types';

import { maintenanceVehicleShape } from './MaintenanceVehicleRealTimeInformationStore';

class MaintenanceVehicleTailStore extends Store {
  static storeName = 'MaintenanceVehicleTailStore';

  static handlers = {
    MaintenanceVehicleTailStart: 'startTail',
    MaintenanceVehicleTailAdd: 'tailAdd',
    MaintenanceVehicleTailEnd: 'endTail',
  };

  constructor(dispatcher) {
    super(dispatcher);
    this.vehicleId = null;
    this.tail = [];
  }

  startTail = vehicleId => {
    this.vehicleId = vehicleId;
    this.tail = [];
    this.emitChange();
  };

  endTail = () => {
    this.vehicleId = null;
    this.tail = [];
    this.emitChange();
  };

  tailAdd = payload => {
    if (payload.id === this.vehicleId) {
      this.tail.push(payload);

      this.emitChange();
    }
  };

  getTail = () => [...this.tail];
  getVehicleId = () => this.vehicleId;
}

export const maintenanceVehicleTailShape = PropTypes.arrayOf(
  maintenanceVehicleShape,
);

export default MaintenanceVehicleTailStore;
