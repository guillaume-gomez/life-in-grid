import React from 'react';

import "./DatePicker.css";

interface DatePickerInterface {
  value: string;
  onChange: (value : string) => void;
}

function DatePicker({ value, onChange } : DatePickerInterface): React.ReactElement {
  return (
    <input
      type="date"
      className="rounded-lg bg-base-100 p-4 h-12 border-current"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default DatePicker;