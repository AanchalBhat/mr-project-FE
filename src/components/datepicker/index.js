import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const CustomDatePicker = (props) => {
  const { label } = props;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(selectedDate)
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        id="date-picker-dialog"
        label={label}
        format="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

CustomDatePicker.propTypes = {
  label: PropTypes.string,
  selectedDate: PropTypes.string,
  handleDateChange: PropTypes.func
};

CustomDatePicker.defaultProps = {
  label: 'Select Date',
  selectedDate: '',
  handleDateChange: () => {},
};

export default CustomDatePicker;
