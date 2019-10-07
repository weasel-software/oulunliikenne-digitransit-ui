export function startTail(actionContext, vehicleId, done) {
  actionContext.dispatch('MaintenanceVehicleTailStart', vehicleId);
  done();
}

export function endTail(actionContext, options, done) {
  actionContext.dispatch('MaintenanceVehicleTailEnd');
  done();
}
