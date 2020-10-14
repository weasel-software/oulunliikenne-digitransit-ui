/**
 * Receives an array with n amount of EcoCounter channel count arrays, combines them and returns
 * a single array with total counts.
 *
 * @param {number[][]} counts
 * @returns {number[]}
 */
export function combineEcoCounterCounts(counts) {
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

export function csvExport(datasets, labels) {
  const exportFilename = 'ecocounter-export.csv';
  const columnTitles = ['Date', ...datasets.map(item => item.label)].join(',');

  const rows = labels.map((dateLabel, index) => {
    return [
      dateLabel,
      ...datasets.map(dataset => dataset.data[index] || 0),
    ].join(',');
  });

  const data = [columnTitles, ...rows].join('\r\n');
  const csvData = new Blob([data], { type: 'text/csv;charset=utf-8;' });

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(csvData, exportFilename);
  } else {
    const el = document.createElement('a');
    el.href = window.URL.createObjectURL(csvData);
    el.setAttribute('download', exportFilename);
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }
}
