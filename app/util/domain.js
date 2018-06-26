/**
 * The content of this file has been copied from:
 * https://github.com/HSLdevcom/hsl-map-publisher/blob/master/src/util/domain.js
 */

const RAIL_ROUTE_ID_REGEXP = /^300[12]/;
const SUBWAY_ROUTE_ID_REGEXP = /^31/;

/**
 * Returns whether a route id is a so called number variant
 * @param {String} routeId - Route id
 * @returns {boolean}
 */
export function isNumberVariant(routeId) {
  return /.{5}[0-9]/.test(routeId);
}

/**
 * Returns whether a route id is belongs to a rail route
 * @param {String} routeId - Route id
 * @returns {boolean}
 */
export function isRailRoute(routeId) {
  return RAIL_ROUTE_ID_REGEXP.test(routeId);
}

/**
 * Returns whether a route id is belongs to a subway route
 * @param {String} routeId - Route id
 * @returns {boolean}
 */
export function isSubwayRoute(routeId) {
  return SUBWAY_ROUTE_ID_REGEXP.test(routeId);
}

/**
 * Returns route id without area code or leading zeros
 * @param {String} routeId - Route id
 * @returns {String}
 */
export default function trimRouteId(routeId) {
  if (isRailRoute(routeId) && isNumberVariant(routeId)) {
    return routeId.substring(0, 5).replace(RAIL_ROUTE_ID_REGEXP, '');
  } else if (isRailRoute(routeId)) {
    return routeId.replace(RAIL_ROUTE_ID_REGEXP, '');
  } else if (isSubwayRoute(routeId) && isNumberVariant(routeId)) {
    return routeId.substring(1, 5).replace(SUBWAY_ROUTE_ID_REGEXP, '');
  } else if (isSubwayRoute(routeId)) {
    return routeId.replace(SUBWAY_ROUTE_ID_REGEXP, '');
  } else if (isNumberVariant(routeId)) {
    // Do not show number variants
    return routeId.substring(1, 5).replace(/^[0]+/g, '');
  }
  return routeId.substring(1).replace(/^[0]+/g, '');
}
