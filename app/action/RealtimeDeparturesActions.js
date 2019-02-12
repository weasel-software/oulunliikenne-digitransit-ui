export function updateDepartures(actionContext, departures, done) {
  actionContext.dispatch('UpdateDepartures', departures);
  done();
}

export function clearDepartures(actionContext, payload, done) {
  actionContext.dispatch('ClearDepartures');
  done();
}
