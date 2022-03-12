import React, { useState } from 'react';
import DatePicker from "./DatePicker";
import { Period } from "./interfaces";

interface PeriodForm extends Omit<Period, 'start' | 'end'> {
  edit: boolean;
  start: string;
  end: string
}

const defaultPeriods : PeriodForm[] = [
  { name: "pre-school", color: "#bbd00d", start: "1900-01-01", end: "1900-12-31", edit: false },
  { name: "middle-school", color: "#17810a", start: "1901-01-01", end: "1901-12-31", edit: false },
  { name: "high-school", color: "#a4580b", start: "1902-01-01", end: "1902-12-31", edit: false },
  { name: "college", color: "#45173b", start: "1903-01-01", end: "1903-12-31", edit: false },
  ]

function FormView() {
  const [periods, setPeriods] = useState<PeriodForm[]>(defaultPeriods);
  const [birthday, setBirthday] = useState<string>("");

  function onChangeItem(index: number, name: keyof PeriodForm, value: unknown) : void {
    if(name === "edit") {
      changeEdit(index, value as boolean);
      return;
    }

    const newPeriods = periods.map((period, indexPeriod) => {
      if(indexPeriod === index) {
        return { ...period , [name]: value};
      }
      return period;
    });
    setPeriods(newPeriods);
  }

  function changeEdit(index: number, value: boolean) {
    const newPeriods = periods.map((period, indexPeriod) => {
      if(indexPeriod === index) {
        return { ...period , edit: value };
      }
      return { ...period , edit: false };
    });
    setPeriods(newPeriods);
  }

  function addTimeslot() {
    const periodsInReadOnly = periods.map((period) => ({ ...period, edit: false }) );
    setPeriods([...periodsInReadOnly, {name: "New timeslot", color: "red", start: "", end: "", edit: true }]);
  }

  function removeTimeslot(indexToDelete: number) {
    const newPeriods = periods.filter((_period, index) => indexToDelete !== index);
    setPeriods(newPeriods);
  }

  function isValid() : boolean {
    const invalidPeriods = periods.filter(period => period.start === "" || period.end === "");
    return birthday !== "" && periods.length > 0 && invalidPeriods.length === 0;
  }

  return (
    <div className="card w-full bg-base-300 shadow-xl">
      <div className="card-body gap-7">
        <h2 className="card-title">Create your life grid</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="label">
              <span className="label-text">Enter your birthday</span>
            </label>
            <DatePicker value={birthday} onChange={setBirthday} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="label">
                <span className="label-text">Create your periods</span>
              </label>
              <button className="btn btn-primary" onClick={addTimeslot}>Add TimeSlot</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full p-2 border rounded-lg shadow-2xl" style={{borderCollapse: "revert", borderColor: "hsl(var(--b1) / var(--tw-bg-opacity))"}}>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Color</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    periods.map( ({name, start, end, color, edit}, index) => {
                      return <TimeSlot
                        position={index + 1}
                        key={index}
                        name={name}
                        start={start}
                        end={end}
                        color={color}
                        edit={edit}
                        onDelete={() => removeTimeslot(index)}
                        onChange={(name, value) => onChangeItem(index, name, value)}
                        />
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" disabled={!isValid()}>Generate 🚀</button>
          </div>
        </div>
      </div>
    </div>
  );
}


interface TimeSlotInterface {
  name: string;
  start: string;
  end: string;
  color: string;
  position: number;
  edit: boolean;
  onChange: (name: keyof PeriodForm, value: unknown) => void;
  onDelete: () => void;
}


function TimeSlot({name, start, end, color, position, edit, onChange, onDelete } : TimeSlotInterface) {
  const editButton = <button className="btn btn-ghost" onClick={() => onChange("edit", !edit)}>✏️</button>;
  const trashButton = <button className="btn btn-ghost" onClick={onDelete}>🗑</button>;

  if(edit) {
    return (
      <tr className="active">
        <th className="w-1/12">{position}</th>
        <td className="w-3/12">
          <input className="input w-full max-w-xs" value={name} onChange={(event) => onChange("name", event.target.value)}/>
        </td>
        <td className="w-3/12">
          <DatePicker value={start} onChange={(value)=> onChange("start",value) } />
        </td>
        <td className="w-3/12">
          <DatePicker value={end} onChange={(value)=> onChange("end",value) } />
        </td>
        <td className="w-1/12">
          <input type="color" value={color} onChange={(event) => onChange("color", event.target.value)}/>
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
        <td className="w-3/12">{name}</td>
        <td className="w-3/12">{start}</td>
        <td className="w-3/12">{end}</td>
        <td className="w-1/12">
          <input disabled type="color" value={color}/>
        </td>
        <td className="w-1/12">
          {editButton}
        </td>
      </tr>
    );
}



export default FormView;
