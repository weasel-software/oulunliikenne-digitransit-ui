import { BicycleRouteLinePriorities } from '../constants';

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

const prioritySorter = (key1, key2) => {
  // if for some reason we have route keys that are
  // not in the priorities mapping, sort them to end
  if (
    BicycleRouteLinePriorities[key1] === undefined &&
    BicycleRouteLinePriorities[key2] !== undefined
  ) {
    return 1;
  }
  if (
    BicycleRouteLinePriorities[key1] !== undefined &&
    BicycleRouteLinePriorities[key2] === undefined
  ) {
    return -1;
  }
  if (
    BicycleRouteLinePriorities[key1] === undefined &&
    BicycleRouteLinePriorities[key2] === undefined
  ) {
    return 0;
  }
  return BicycleRouteLinePriorities[key1] - BicycleRouteLinePriorities[key2];
};

export const getSortedItems = items =>
  Object.keys(items)
    .sort(prioritySorter)
    .map(key => ({ type: key, ...items[key] }));

export default getBicycleRouteKey;
