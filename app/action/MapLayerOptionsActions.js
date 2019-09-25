export function updateMapLayerOptions(actionContext, mapLayerOptions) {
  actionContext.dispatch('UpdateMapLayerOptions', mapLayerOptions);
}

export function resetMapLayerOptions(actionContext) {
  actionContext.dispatch('ResetMapLayerOptions');
}
