import React, { useState } from 'react';
import { range } from "lodash";
import "./DatePicker.css";

interface DatePickerInterface {
  value: string;
  onChange: (value : string) => void;
}

function DatePicker({ value, onChange } : DatePickerInterface): React.ReactElement {
  const [maxYear] = useState<number>(new Date().getFullYear() + 100);
  function getNumberOfDays(month: number): number {
    if(month === 2) {
      return 29;
    }
    if([1,3,5,7,8, 10, 12].includes(month)) {
      return 31;
    }
    return 30;
  }

  function getDay(): number {
    return parseInt(value.split("-")[2], 10);
  }

  function getMonth(): number {
    return parseInt(value.split("-")[1], 10);
  }

  function getYear(): number {
    return parseInt(value.split("-")[0], 10);
  }

  return (
    <div className="w-full flex-col md:flex-row flex gap-1">
      <select className="select max-w-xs" value={getYear()} onChange={(event) => onChange(`${event.target.value}-${getMonth()}-${getDay()}`)}>
        <option disabled selected>Year</option>
        {range(1950, maxYear).reverse().map(year => 
          <option>{year}</option>
        )}
      </select>
      <select className="select max-w-xs" value={getMonth()} onChange={(event) => onChange(`${getYear()}-${event.target.value}-${getDay()}`)}>
        <option disabled selected>Month</option>
        {range(1, 12).map(month => 
          <option>{month}</option>
        )}
      </select>
      <select className="select max-w-xs" value={getDay()} onChange={(event) => onChange(`${getYear()}-${getMonth()}-${event.target.value}`)}>
        <option disabled selected>Day</option>
        {range(1, getNumberOfDays(getDay())).map(day => 
          <option>{day}</option>
        )}
      </select>
    </div>
  );
}

export default DatePicker;