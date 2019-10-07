import Store from 'fluxible/addons/BaseStore';
import PropTypes from 'prop-types';

class MaintenanceVehicleRealTimeInformationStore extends Store {
  static storeName = 'MaintenanceVehicleRealTimeInformationStore';

  constructor(dispatcher) {
    super(dispatcher);
    this.maintenanceVehicles = {};
    this.subscriptions = [];
  }

  storeClient(data) {
    this.client = data.client;
    this.subscriptions = data.topics;

    this.emitChange();
  }

  clearClient() {
    this.client = undefined;
    this.maintenanceVehicles = {};
    this.subscriptions = [];

    this.emitChange();
  }

  updateSubscriptions(topics) {
    this.subscriptions = topics;
    this.maintenanceVehicles = {};

    this.emitChange();
  }

  handleMessage(message) {
    this.maintenanceVehicles[message.id] = message.message;
    this.emitChange();
  }

  static handlers = {
    MaintenanceVehicleRealTimeClientStarted: 'storeClient',
    MaintenanceVehicleRealTimeClientStopped: 'clearClient',
    MaintenanceVehicleRealTimeClientMessage: 'handleMessage',
    MaintenanceVehicleRealTimeClientTopicChanged: 'updateSubscriptions',
  };
}

export const maintenanceVehicleShape = PropTypes.shape({
  id: PropTypes.number,
  jobIds: PropTypes.arrayOf(PropTypes.number),
  timestamp: PropTypes.number,
  lat: PropTypes.number,
  long: PropTypes.number,
  dir: PropTypes.number,
});

export default MaintenanceVehicleRealTimeInformationStore;
