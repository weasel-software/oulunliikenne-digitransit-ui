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
    renderMonthElement: PropTypes.func,
  };

  static defaultProps = {
    renderMonthElement: null,
  };

  state = {
    isDatePickerOpen: false,
    openDatePicker: null,
    range1HasError: false,
    range1ErrorRange: null,
    range2HasError: false,
    range2ErrorRange: null,
  };

  onTitleClick = () => {
    this.setState({
      isDatePickerOpen: !this.state.isDatePickerOpen,
    });
  };

  onDateChange = datePickerName => newDate => {
    newDate.set('hour', 0);
    this.setState({ isDatePickerOpen: false, openDatePicker: null });

    let range;

    switch (datePickerName) {
      case RANGE1_START:
        range = [newDate, this.props.range1[1]];
        break;
      case RANGE1_END:
        range = [this.props.range1[0], newDate];
        break;
      case RANGE2_START:
        range = [newDate, this.props.range2[1]];
        break;
      case RANGE2_END:
        range = [this.props.range2[0], newDate];
        break;
      default:
        break;
    }

    const isAllowedRange = this.isAllowedRange(range);
    const isRange1 =
      datePickerName === RANGE1_START || datePickerName === RANGE1_END;

    if (isRange1) {
      this.setState({
        range1HasError: !isAllowedRange,
        range1ErrorRange: !isAllowedRange ? range : null,
        range2HasError: this.state.range2HasError,
        range2ErrorRange: this.state.range2ErrorRange,
      });
    } else {
      this.setState({
        range1HasError: this.state.range1HasError,
        range1ErrorRange: this.state.range1ErrorRange,
        range2HasError: !isAllowedRange,
        range2ErrorRange: !isAllowedRange ? range : null,
      });
    }

    if (!isAllowedRange) {
      return;
    }

    if (isRange1) {
      this.props.onRange1Change(range);
    } else {
      this.props.onRange2Change(range);
    }
  };

  isAllowedRange = range => range[1].diff(range[0], 'days') > 0;

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
    const { range1, range2, renderMonthElement } = this.props;
    const {
      isDatePickerOpen,
      openDatePicker,
      range1HasError,
      range1ErrorRange,
      range2ErrorRange,
      range2HasError,
    } = this.state;
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
                aria-label={`${this.props.formatMessage({
                  id: 'choose-date',
                  defaultMessage: 'Choose date',
                })}, ${range1[0].format('D.M.Y')}`}
              >
                <span className="value">
                  {range1HasError
                    ? range1ErrorRange[0].format('D.M.Y')
                    : range1[0].format('D.M.Y')}
                </span>
                {calendarIcon}
              </button>
            </div>
            <div className="date-row__input-group__separator">-</div>
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE1_END)}
                aria-label={`${this.props.formatMessage({
                  id: 'choose-date',
                  defaultMessage: 'Choose date',
                })}, ${range1[1].format('D.M.Y')}`}
              >
                <span className="value">
                  {range1HasError
                    ? range1ErrorRange[1].format('D.M.Y')
                    : range1[1].format('D.M.Y')}
                </span>
                {calendarIcon}
              </button>
            </div>
            <div
              className={cn('datepicker-error', {
                'is-visible': range1HasError,
              })}
            >
              <small>{`${this.props.formatMessage({
                id: 'choose-date-error',
                defaultMessage:
                  'The end date must be greater than the start date.',
              })}`}</small>
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
                numberOfMonths={1}
                renderMonthElement={renderMonthElement}
              />
            </div>
            <div
              className={cn('datepicker-container', {
                'is-visible': isDatePickerOpen && openDatePicker === RANGE1_END,
              })}
            >
              <DayPickerSingleDateController
                date={range1end}
                onDateChange={this.onDateChange(RANGE1_END)}
                numberOfMonths={1}
                renderMonthElement={renderMonthElement}
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
                aria-label={`${this.props.formatMessage({
                  id: 'choose-date',
                  defaultMessage: 'Choose date',
                })}, ${range2[0].format('D.M.Y')}`}
              >
                <span className="value">
                  {range2HasError
                    ? range2ErrorRange[0].format('D.M.Y')
                    : range2[0].format('D.M.Y')}
                </span>
                {calendarIcon}
              </button>
            </div>
            <div className="date-row__input-group__separator">-</div>
            <div className="date-row__input-group__input-container">
              <button
                className="date-row__input-group__input"
                onClick={this.toggleDatePicker(RANGE2_END)}
                aria-label={`${this.props.formatMessage({
                  id: 'choose-date',
                  defaultMessage: 'Choose date',
                })}, ${range2[1].format('D.M.Y')}`}
              >
                <span className="value">
                  {range2HasError
                    ? range2ErrorRange[1].format('D.M.Y')
                    : range2[1].format('D.M.Y')}
                </span>
                {calendarIcon}
              </button>
            </div>
            <div
              className={cn('datepicker-error', {
                'is-visible': range2HasError,
              })}
            >
              <small>{`${this.props.formatMessage({
                id: 'choose-date-error',
                defaultMessage:
                  'The end date must be greater than the start date.',
              })}`}</small>
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
                renderMonthElement={renderMonthElement}
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
                renderMonthElement={renderMonthElement}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
