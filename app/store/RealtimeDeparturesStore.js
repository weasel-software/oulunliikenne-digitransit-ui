import Store from 'fluxible/addons/BaseStore';

class RealtimeDeparturesStore extends Store {
  static storeName = 'RealtimeDeparturesStore';

  static handlers = {
    UpdateDepartures: 'updateDepartures',
    ClearDepartures: 'clearDepartures',
  };

  departures = null;

  constructor(dispatcher) {
    super(dispatcher);
    this.updateDepartures();
  }

  updateDepartures = departures => {
    this.departures = Array.isArray(departures)
      ? departures.map(departure => ({
          ...departure,
          pattern: {
            ...departure.pattern,
            stops: [...departure.trip.stops]
              .reverse()
              .reduce(
                (result, stop) =>
                  result.length || stop.code === departure.stop.code
                    ? [...result, stop]
                    : result,
                [],
              ),
          },
        }))
      : null;

    this.emitChange();
  };

  clearDepartures = () => {
    this.departures = null;
    this.emitChange();
  };

  getDepartures() {
    return this.departures;
  }
}

export default RealtimeDeparturesStore;
