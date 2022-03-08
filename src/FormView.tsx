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

  function onChangeItem(index: number, name: keyof PeriodForm, value: unknown) : void {
    const newPeriods = periods.map((period, indexPeriod) => {
      if(indexPeriod === index) {
        return { ...period , [name]: value};
      }
      return period;
    });
    setPeriods(newPeriods);
  }

  return (
    <div className="card w-full bg-base-300 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title">Create your timeline</h2>
          <button className="btn btn-primary">Add TimeSlot</button>
        </div>
        <div className="flex flex-col gap-7">
          <div className="overflow-x-auto">
            <table className="table w-full">
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
                      onChange={(name, value) => onChangeItem(index, name, value)}
                      />
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Generate 🚀</button>
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
}


function TimeSlot({name, start, end, color, position, edit, onChange } : TimeSlotInterface) {
  if(edit) {
    return (
      <tr>
        <th>{position}</th>
        <td>
          <input value={name} onChange={(event) => onChange("name", event.target.value)}/>
        </td>
        <td>
          <input type="date" value={start} onChange={(event) => onChange("start", event.target.value)}/>
        </td>
        <td>
          <input type="date" value={end} onChange={(event) => onChange("end", event.target.value)}/>
        </td>
        <td>
          <input value={color} onChange={(event) => onChange("color", event.target.value)}/>
        </td>
        <td>
          <button onClick={() => onChange("edit", !edit)}>✏️</button>
        </td>
      </tr>
    );
  }


  return (
      <tr>
        <th>{position}</th>
        <td>{name}</td>
        <td>{start}</td>
        <td>{end}</td>
        <td>{color}</td>
        <td>
          <button onClick={() => onChange("edit", !edit)}>✏️</button>
        </td>
      </tr>
    );
}



export default FormView;
