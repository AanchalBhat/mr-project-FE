import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles, InputLabel, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MuiNativeSelect from "@material-ui/core/NativeSelect";

const NativeSelect = withStyles((theme) => ({
  select: {
    paddingLeft: theme.spacing(0.5),
  },
}))(MuiNativeSelect);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5, 0),
    width: "100%",
  },
}));

const CustomDropdown = (props) => {
  const classes = useStyles();

  const {
    value,
    label,
    options,
    handleChange,
    handleBlur,
    isDisabled,
    required,
    error,
  } = props;

  const [option, setOption] = useState(value || options[0].value || "");
  const onChange = (event) => {
    setOption(event.target.value);
    handleChange(event.target.value);
  };

  const onBlur = (event) => {
    setOption(event.target.value);
    handleBlur(event.target.value);
  };

  return (
    <FormControl
      required={required}
      error={error}
      className={classes.formControl}
      disabled={isDisabled}
    >
      <InputLabel htmlFor="age-native-helper">{label}</InputLabel>
      <NativeSelect value={option} onChange={onChange} onBlur={onBlur}>
        {options.map((option, index) => (
          <option value={option.value} key={`${option.value}-${index}`}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.bool,
};

CustomDropdown.defaultProps = {
  value: "",
  label: "",
  options: [],
  required: false,
  error: false,
  isDisabled: false,
  handleChange: () => {},
  handleBlur: () => {},
};

export default CustomDropdown;
