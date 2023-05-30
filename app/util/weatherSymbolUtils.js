// RegExps to check if symbol code is in range of d1xx
const d100RegExp = /^(d|n)([1][0-4][0-2])$/;

/**
 * Formats weather symbol codes that doesn't have corresponding weather symbol icon available.
 *
 * Sometimes digitraffic returns weather codes that doesn't have any corresponding weather icons available. e.g. `d110`, `d120`.
 *
 * See https://developer.foreca.com/resources.
 *
 * @param {string} weatherSymbol
 * @returns {string}
 */
export default function formatWeatherSymbol(weatherSymbol) {
  if (d100RegExp.test(weatherSymbol)) {
    const prefix = weatherSymbol.slice(0, 1);
    return `${prefix}100`;
  }

  return weatherSymbol;
}
