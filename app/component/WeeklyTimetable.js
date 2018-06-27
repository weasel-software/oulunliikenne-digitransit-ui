import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import padStart from 'lodash/padStart';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';

import CardHeader from './CardHeader';
import Icon from './Icon';
import trimRouteId from '../util/domain';
import * as sampleData from './data/WeeklyTimetable';

class WeeklyTimetable extends React.Component {
  dateForPrinting = (dateBegin, dateEnd, period) => (
    <div className="timetable-for-printing">
      <div className="printable-date-container">
        <div className="printable-date-icon">
          <Icon className="large-icon" img="icon-icon_schedule" />
        </div>
        <div>
          <div className="printable-date-header">
            <FormattedMessage
              defaultMessage="Validity period"
              id="timetable-validity-period"
            />
          </div>
          <div className="printable-date-content">
            {period ? `${period} ` : null}
            {moment(dateBegin).format('DD.MM.YYYY')}&nbsp;-&nbsp;
            {moment(dateEnd).format('DD.MM.YYYY')}
          </div>
        </div>
      </div>
    </div>
  );

  hasNote = departure => !isEmpty(departure.note);

  hasNotes = (departuresArray, notes) =>
    !isEmpty(notes) && departuresArray.some(this.hasNote);

  renderHourlyRows = departuresArray => {
    const departuresByHour = groupBy(
      departuresArray.map(wd => ({
        ...wd,
        hourKey: wd.hours + (wd.isNextDay ? 24 : 0),
      })),
      wd => wd.hourKey,
    );

    return Object.keys(departuresByHour)
      .sort((a, b) => a - b)
      .map(hourKey => {
        const departures = departuresByHour[hourKey];
        const hour = padStart(departures[0] && departures[0].hours, 2, '0');
        return (
          <div className="timetable-row" key={hourKey}>
            <h1 className="title bold">{hour}:</h1>
            <div className="timetable-printable-title">{hour}</div>
            <div className="timetable-rowcontainer">
              {departures
                .sort((a, b) => a.minutes - b.minutes)
                .map(departure => (
                  <div
                    className="timetablerow-linetime"
                    key={`${departure.minutes}-${departure.routeId}`}
                  >
                    <span>
                      <div>
                        <span className="bold">
                          {padStart(departure.minutes, 2, '0')}
                        </span>
                        <span className="line-name">
                          /{trimRouteId(departure.routeId)}
                          {this.hasNote(departure) && (
                            <span className="bold">{departure.note}</span>
                          )}
                        </span>
                      </div>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );
      });
  };

  renderPeriodRows = (departuresArray, notes) => (
    <div className="momentum-scroll">
      <div className="timetable-time-headers">
        <div className="hour">
          <FormattedMessage id="hour" defaultMessage="Hour" />
        </div>
        <div className="minutes-per-route">
          <FormattedMessage id="minutes-or-route" defaultMessage="Min/Route" />
        </div>
      </div>
      {this.renderHourlyRows(departuresArray)}
      {this.hasNotes(departuresArray, notes) && (
        <div className="route-remarks">
          <h1>
            <FormattedMessage id="explanations" defaultMessage="Explanations" />:
          </h1>
          {notes.map(o => (
            <div className="remark-row" key={`${o}`}>
              <span>{o}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  render() {
    const {
      dateBegin,
      dateEnd,
      language,
      notes,
      saturdays,
      sundays,
      stopNameFi,
      stopNameSe,
      stopShortId,
      weekdays,
    } = this.props;

    const { intl } = this.context;

    return (
      <React.Fragment>
        <CardHeader
          code={stopShortId}
          headingStyle="h1"
          icon="icon-icon_bus-stop"
          name={language === 'sv' ? stopNameSe : stopNameFi}
          unlinked
        />
        <div className="timetable">
          <div className="timetable-for-printing-header">
            <h1>
              <FormattedMessage id="timetable" defaultMessage="Timetable" />
            </h1>
          </div>
          {this.dateForPrinting(
            dateBegin,
            dateEnd,
            intl.formatMessage({
              defaultMessage: 'Monday to Friday',
              id: 'timetable-monday-to-friday',
            }),
          )}
          {this.renderPeriodRows(weekdays, notes)}
          {this.dateForPrinting(
            dateBegin,
            dateEnd,
            intl.formatMessage({
              defaultMessage: 'Saturday',
              id: 'timetable-on-saturdays',
            }),
          )}
          {this.renderPeriodRows(saturdays, notes)}
          {this.dateForPrinting(
            dateBegin,
            dateEnd,
            intl.formatMessage({
              defaultMessage: 'Sunday',
              id: 'timetable-on-sundays',
            }),
          )}
          {this.renderPeriodRows(sundays, notes)}
        </div>
      </React.Fragment>
    );
  }
}

const routeEntryShape = PropTypes.shape({
  hours: PropTypes.number,
  minutes: PropTypes.number,
  note: PropTypes.string,
  routeId: PropTypes.string,
  isNextDay: PropTypes.bool,
  dateBegin: PropTypes.string,
  dateEnd: PropTypes.string,
});

WeeklyTimetable.propTypes = {
  weekdays: PropTypes.arrayOf(routeEntryShape).isRequired,
  saturdays: PropTypes.arrayOf(routeEntryShape).isRequired,
  sundays: PropTypes.arrayOf(routeEntryShape).isRequired,
  notes: PropTypes.arrayOf(PropTypes.string).isRequired,
  dateBegin: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  language: PropTypes.oneOf('fi', 'sv', 'en'),
  stopNameFi: PropTypes.string.isRequired,
  stopNameSe: PropTypes.string.isRequired,
  stopShortId: PropTypes.string.isRequired,
};

WeeklyTimetable.defaultProps = {
  language: 'fi',
};

WeeklyTimetable.contextTypes = {
  intl: intlShape.isRequired,
};

WeeklyTimetable.description = () => (
  <React.Fragment>
    <WeeklyTimetable {...sampleData.default.sample1} />
    <WeeklyTimetable {...sampleData.default.sample2} />
    <WeeklyTimetable {...sampleData.default.sample3} />
    <WeeklyTimetable {...sampleData.default.sample4} />
    <WeeklyTimetable {...sampleData.default.sample5} />
  </React.Fragment>
);

export default WeeklyTimetable;
