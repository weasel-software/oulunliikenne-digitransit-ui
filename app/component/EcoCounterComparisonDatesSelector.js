import React from 'react';
import PropTypes from 'prop-types';
import { DayPickerSingleDateController } from 'react-dates';
import cn from 'classnames';
import Icon from './Icon';

export const RANGE1_START = 'RANGE1_START';
export const RANGE1_END = 'RANGE1_END';
export const RANGE2_START = 'RANGE2_START';
export const RANGE2_END = 'RANGE2_END';

export default class EcoCounterComparisonDatesSelector extends React.Component {
  static propTypes = {
    range1: PropTypes.arrayOf(PropTypes.object).isRequired,
    range2: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRange1Change: PropTypes.func.isRequired,
    onRange2Change: PropTypes.func.isRequired,
    formatMessage: PropTypes.func.isRequired,
    toggleView: PropTypes.func.isRequired,
  };

  state = {
    isDatePickerOpen: false,
    openDatePicker: null,
  };

  onTitleClick = () => {
    this.setState({
      isDatePickerOpen: !this.state.isDatePickerOpen,
    });
  };

  onDateChange = datePickerName => newDate => {
    this.setState({ isDatePickerOpen: false, openDatePicker: null });
    switch (datePickerName) {
      case RANGE1_START:
        this.props.onRange1Change([newDate, this.props.range1[1]]);
        break;
      case RANGE1_END:
        this.props.onRange1Change([this.props.range1[0], newDate]);
        break;
      case RANGE2_START:
        this.props.onRange2Change([newDate, this.props.range2[1]]);
        break;
      case RANGE2_END:
        this.props.onRange2Change([this.props.range2[0], newDate]);
        break;
      default:
        break;
    }
  };

  toggleDatePicker = datePickerName => () => {
    if (this.state.openDatePicker === datePickerName) {
      this.setState({
        isDatePickerOpen: false,
        openDatePicker: null,
      });
    } else {
      this.setState({
        isDatePickerOpen: true,
        openDatePicker: datePickerName,
      });
    }
  };

  render() {
    const { range1, range2 } = this.props;
    const { isDatePickerOpen, openDatePicker } = this.state;
    const [range1start, range1end] = range1;
    const [range2start, range2end] = range2;

    const calendarIcon = (
      <span className="icon-container">
        <Icon img="icon-icon_calendar" viewBox="0 0 25 25" />
      </span>
    );

    return (
      <div className="eco-counter-content__comparison-dates">
        <div className="date-row">
          <div className="date-row__label">
            {this.props.formatMessage({ id: '1. time range' })}
          </div>
          <div className="date-row__input-group">
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE1_START)}
              >
                <span className="value">{range1[0].format('D.M.Y')}</span>
                {calendarIcon}
              </button>
            </div>
            <div className="date-row__input-group__separator">-</div>
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE1_END)}
              >
                <span className="value">{range1[1].format('D.M.Y')}</span>
                {calendarIcon}
              </button>
            </div>
            <div
              className={cn('datepicker-container', {
                'is-visible':
                  isDatePickerOpen && openDatePicker === RANGE1_START,
              })}
            >
              <DayPickerSingleDateController
                date={range1start}
                onDateChange={this.onDateChange(RANGE1_START)}
              />
            </div>
            <div
              className={cn('datepicker-container', {
                'is-visible': isDatePickerOpen && openDatePicker === RANGE1_END,
              })}
            >
              <DayPickerSingleDateController
                key={range1end}
                date={range1end}
                onDateChange={this.onDateChange(RANGE1_END)}
              />
            </div>
          </div>
        </div>
        <div className="date-row">
          <div className="date-row__label">
            {this.props.formatMessage({ id: '2. time range' })}
          </div>
          <div className="date-row__input-group">
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE2_START)}
              >
                <span className="value">{range2[0].format('D.M.Y')}</span>
                {calendarIcon}
              </button>
            </div>
            <div className="date-row__input-group__separator">-</div>
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE2_END)}
              >
                <span className="value">{range2[1].format('D.M.Y')}</span>
                {calendarIcon}
              </button>
            </div>
            <div
              className={cn('datepicker-container', {
                'is-visible':
                  isDatePickerOpen && openDatePicker === RANGE2_START,
              })}
            >
              <DayPickerSingleDateController
                date={range2start}
                onDateChange={this.onDateChange(RANGE2_START)}
                numberOfMonths={1}
              />
            </div>
            <div
              className={cn('datepicker-container', {
                'is-visible': isDatePickerOpen && openDatePicker === RANGE2_END,
              })}
            >
              <DayPickerSingleDateController
                date={range2end}
                onDateChange={this.onDateChange(RANGE2_END)}
                numberOfMonths={1}
              />
            </div>
          </div>
        </div>
        <button className="toggleViewButton" onClick={this.props.toggleView}>
          {this.props.formatMessage({ id: 'close-comparison' })}
          <Icon img="icon-icon_close" viewBox="0 0 25 25" />
        </button>
      </div>
    );
  }
}
