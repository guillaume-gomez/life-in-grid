import React from "react";
import DatePicker from "../Components/DatePicker";
import DataForm from "../reducers/useCreateLifeInGridReducer";

function BirthdayForm() : React.ReactElement {
  const { birthday, setBirthday } = DataForm.useContainer();
  return (
    <div className="prose">
      <h2>Enter your birthday date</h2>
      <label className="label">
        <span className="label-text text-lg">Birthday</span>
      </label>
      <DatePicker value={birthday} onChange={setBirthday} />
    </div>
  );
}

export default BirthdayForm;