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

export function setHighlightedFluency(actionContext, stop) {
  actionContext.dispatch('SetHighlightedFluency', stop);
}

export function removeHighlightedFluency(actionContext) {
  actionContext.dispatch('RemoveHighlightedFluency');
}
