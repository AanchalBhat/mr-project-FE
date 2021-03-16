import React from 'react';
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Input,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useStyles } from './styles';

const MultiSelect = (props) => {
  const {
    handleChange,
    value,
    options,
    label,
    required,
    error,
    isDisabled,
  } = props;
  const classes = useStyles();
  return (
    <FormControl
      required={required}
      error={error}
      className={classes.formControl}
      disabled={isDisabled}
    >
      <InputLabel id="mutiple-checkbox-label">{label}</InputLabel>
      <Select
        labelId="mutiple-checkbox-label"
        id="mutiple-checkbox"
        multiple
        value={value}
        onChange={handleChange}
        input={<Input className={classes.input} />}
        renderValue={(selected) => selected.join(', ')}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
