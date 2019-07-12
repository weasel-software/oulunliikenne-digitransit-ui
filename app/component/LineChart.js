import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import isEqual from 'lodash/isEqual';
import omit from 'lodash-es/omit';

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
    });
  }

  componentDidUpdate(prevProps) {
    const omitCircularReferences = datasets =>
      datasets.map(ds => omit(ds, '_meta'));
    const currData = omitCircularReferences(this.props.datasets);
    const prevData = omitCircularReferences(prevProps.datasets);

    if (this.props.datasets && this.chart && !isEqual(currData, prevData)) {
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
