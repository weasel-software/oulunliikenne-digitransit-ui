import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

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

  render() {
    return <canvas ref={this.chartRef} height={400} width={400} />;
  }
}

export default LineChart;
