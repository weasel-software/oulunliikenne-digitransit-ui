/**
 * Receives an array with n amount of EcoCounter channel count arrays, combines them and returns
 * a single array with total counts.
 *
 * @param {number[][]} counts
 * @returns {number[]}
 */
export default function combineEcoCounterCounts(counts) {
  if (!counts || counts.length < 0) {
    return [];
  }
  if (counts.length === 1) {
    return counts[0];
  }

  return counts.reduce((acc, currentCounts) => {
    currentCounts.forEach((value, i) => {
      if (!acc[i]) {
        acc[i] = 0;
      }

      acc[i] += value;
    });

    return acc;
  }, []);
}
