import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

class LineChart extends React.Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.chart = new Chart(this.chartRef.current, {
      type: 'line',
      data: {
        labels: this.props.labels,
        datasets: this.props.datasets,
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  componentDidUpdate(prevProps) {
    const omitCircularReferences = datasets =>
      datasets.map(ds => omit(ds, '_meta'));
    const currData = omitCircularReferences(this.props.datasets);
    const prevData = omitCircularReferences(prevProps.datasets);

    // persist selections between updates based on order of datasets
    const persistDatasetSelection = (chartInstance, incomingDataset) => {
      if (chartInstance.data.datasets && chartInstance.data.datasets.length) {
        for (let i = 0; i < chartInstance.data.datasets.length; i++) {
          const isVisible = chartInstance.isDatasetVisible(i);
          const incomingDatasetEntry = incomingDataset[i];
          if (incomingDatasetEntry) {
            incomingDatasetEntry.hidden = !isVisible;
          }
        }
      }
      return incomingDataset;
    };

    if (this.props.datasets && this.chart && !isEqual(currData, prevData)) {
      this.chart.data.datasets = persistDatasetSelection(
        this.chart,
        this.props.datasets,
      );
      this.chart.data.labels = this.props.labels;
      this.chart.update();
    }
  }

  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default LineChart;
