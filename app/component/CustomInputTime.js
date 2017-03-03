import React, { PropTypes } from 'react';
import { isMobile } from '../util/browser';

export default function CustomInputTime({ changeTime, time }) {
  let timeInput = null;
  return (
    <input
      type="time"
      className={`time-selector ${!isMobile ? 'time-selector' : ''}`}
      value={time}
      onChange={changeTime}
      ref={(input) => {
          // use ref callback to bind change listener so that it works on android/firefox too
        if (input !== null && timeInput === null) {
          timeInput = input;
          const listener = (a) => {
            changeTime(a); a.target.blur(); a.target.removeEventListener('change', this);
          };
          input.addEventListener('change', listener);
        }
      }}
    />
  );
}


CustomInputTime.propTypes = {
  changeTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
};
