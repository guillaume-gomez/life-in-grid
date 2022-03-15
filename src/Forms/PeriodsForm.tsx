import React from "react";
import DatePicker from "../Components/DatePicker";
import DataForm from "../reducers/useCreateLifeInGridReducer";
import { PeriodFormInterface } from "../interfaces";

function PeriodsForm() : React.ReactElement {
    const { periods, addPeriod, removePeriod, onChangePeriod } = DataForm.useContainer();
    return (
      <div className="bg-neutral rounded-lg p-5 flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="label prose">
            <h2 className="label-text">Create your periods</h2>
          </label>
          <button className="btn btn-primary" onClick={addPeriod}>Add Period</button>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full" style={{borderCollapse: "revert", borderColor: "hsl(var(--b1) / var(--tw-bg-opacity))"}}>
            <thead>
              <tr>
                <th>Position</th>
                <th>TimeSlot Id</th>
                <th>Start</th>
                <th>End</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                periods.map( ({timeSlotId, start, end, edit}, index) => {
                  return <TimeSlot
                    position={index + 1}
                    key={index}
                    timeSlotId={timeSlotId}
                    start={start}
                    end={end}
                    edit={edit}
                    onDelete={() => removePeriod(index)}
                    onChange={(name, value) => onChangePeriod(index, name, value)}
                    />
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default PeriodsForm;


interface TimeSlotInterface {
  timeSlotId: string;
  start: string;
  end: string;
  position: number;
  edit: boolean;
  onChange: (name: keyof PeriodFormInterface, value: unknown) => void;
  onDelete: () => void;
}

function TimeSlot({ timeSlotId, start, end, position, edit, onChange, onDelete } : TimeSlotInterface) {
  const { timeSlots } = DataForm.useContainer();
  const editButton = <button className="btn btn-ghost" onClick={() => onChange("edit", !edit)}>✏️</button>;
  const trashButton = <button className="btn btn-ghost" onClick={onDelete}>🗑</button>;
  const timeSlotSelectFunction =(disabled: boolean) => (
    <select className="select w-full max-w-xs" disabled={disabled} onChange={(event) => onChange("timeSlotId", event.target.value)}>
      <option disabled selected>Pick a time slot</option>
      {
        timeSlots.map(timeSlot =>
          <option value={timeSlot.id}>{timeSlot.name}</option>
        )
      }
    </select>
  );

  if(edit) {
    return (
      <tr className="active">
        <th className="w-1/12">{position}</th>
        <td className="w-3/12">
          {timeSlotSelectFunction(false)}
        </td>
        <td className="w-3/12">
          <DatePicker value={start} onChange={(value)=> onChange("start",value) } />
        </td>
        <td className="w-3/12">
          <DatePicker value={end} onChange={(value)=> onChange("end",value) } />
        </td>
        <td className="w-1/12">
          {editButton}
          {trashButton}
        </td>
      </tr>
    );
  }


  return (
      <tr onClick={()=> onChange("edit", true)}>
        <th className="w-1/12">{position}</th>
        <td className="w-3/12">{timeSlotSelectFunction(true)}</td>
        <td className="w-3/12">{start}</td>
        <td className="w-3/12">{end}</td>
        <td className="w-1/12">
          {editButton}
        </td>
      </tr>
    );
}

