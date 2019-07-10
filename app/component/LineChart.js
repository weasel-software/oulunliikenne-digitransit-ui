import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

class LineChart extends React.Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    console.log('this.chartRef', this.chartRef);
    this.chart = new Chart(this.chartRef.current, {
      type: 'line',
      data: {
        labels: this.props.labels,
        datasets: [
          {
            data: this.props.data,
          },
        ],
      },
    });
  }

  render() {
    return <canvas ref={this.chartRef} height={400} />;
  }
}

export default LineChart;
