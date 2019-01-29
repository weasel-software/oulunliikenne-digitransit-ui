export function updateMapLayers(actionContext, mapLayerSettings) {
  actionContext.dispatch('UpdateMapLayers', mapLayerSettings);
}

export function updateMapLayersMode(actionContext, mode) {
  actionContext.dispatch('UpdateMapLayersMode', mode);
}
