import React from "react";
import DatePicker from "./DatePicker";

interface BirthdayFormInterface {
  birthday: string;
  onChange: (date: string) => void
}

function BirthdayForm({ birthday, onChange } : BirthdayFormInterface) : React.ReactElement {
  return (
    <div className="prose">
      <h2>Enter your birthday date</h2>
      <label className="label">
        <span className="label-text text-lg">Birthday</span>
      </label>
      <DatePicker value={birthday} onChange={onChange} />
    </div>
  );
}

export default BirthdayForm;