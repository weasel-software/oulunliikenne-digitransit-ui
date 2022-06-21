import PropTypes from 'prop-types';
import React from 'react';

class Select extends React.Component {
  static propTypes = {
    onSelectChange: PropTypes.func.isRequired,
    headerText: PropTypes.string,
    selected: PropTypes.string,
    ariaLabel: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        displayNameObject: PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.string,
        ]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }).isRequired,
    ).isRequired,
  };

  static defaultProps = {
    headerText: undefined,
    selected: undefined,
    ariaLabel: '',
  };

  static getOptionTags(options) {
    return options.map(option => (
      <option key={option.displayName + option.value} value={option.value}>
        {option.displayNameObject
          ? option.displayNameObject
          : option.displayName}
      </option>
    ));
  }

  render() {
    const { headerText } = this.props;
    return (
      <React.Fragment>
        {headerText && <h5>{headerText}</h5>}
        <select
          onChange={this.props.onSelectChange}
          value={this.props.selected}
          aria-label={this.props.ariaLabel}
        >
          {Select.getOptionTags(this.props.options)}
        </select>
      </React.Fragment>
    );
  }
}

export default Select;
