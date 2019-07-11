import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import isEqual from 'lodash/isEqual';

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
        legend: {
          reverse: true,
        },
      },
    });
  }

  componentDidUpdate(prevProps) {
    const prevData = Object.keys(prevProps.datasets)
      .map(key => prevProps.datasets[key].data)
      .flat()
      .sort();
    const currData = Object.keys(this.props.datasets)
      .map(key => this.props.datasets[key].data)
      .flat()
      .sort();
    if (this.props.datasets && this.chart && !isEqual(prevData, currData)) {
      this.chart.data.datasets = this.props.datasets;
      this.chart.data.labels = this.props.labels;
      this.chart.update();
    }
  }

  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default LineChart;
