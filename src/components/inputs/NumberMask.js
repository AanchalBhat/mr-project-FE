import React, { useState } from 'react';
import NumberFormat from 'react-number-format';

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  const [last, setLast] = useState(false);
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values.value);
      }}
      onKeyUp={(e) => {
        if (last && e.which === 8) {
          onChange('');
          setLast(false);
        } else if (e.which === 8 && e.currentTarget.value.length === 2) {
          setLast(true);
        }
      }}
      thousandSeparator
      decimalScale={2}
      isAllowed={(v) => v.floatValue <= 999999999.99}
      prefix="$"
    />
  );
};

export default NumberFormatCustom;
