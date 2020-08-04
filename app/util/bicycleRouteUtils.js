export const getBicycleRouteKey = (layerName, type) => {
  const suffix = type ? `-${type}` : '';
  const prefix = {
    bicycleRoutesBaana: 'BAANA',
    bicycleRoutesBrand: 'BRAND',
    bicycleRoutesMainRegional: 'MAIN_REGIONAL',
    bicycleRouteTypes: 'TYPES',
  }[layerName];
  return prefix ? `${prefix}${suffix}` : null;
};

export default getBicycleRouteKey;
