export function updateMapLayers(actionContext, mapLayerSettings) {
  actionContext.dispatch('UpdateMapLayers', mapLayerSettings);
}

export function updateMapLayersMode(actionContext, mode) {
  actionContext.dispatch('UpdateMapLayersMode', mode);
}

export function setHighlightedStop(actionContext, stop) {
  actionContext.dispatch('SetHighlightedStop', stop);
}

export function removeHighlightedStop(actionContext) {
  actionContext.dispatch('RemoveHighlightedStop');
}
