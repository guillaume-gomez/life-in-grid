import React, { useState } from 'react';
import DatePicker from "./DatePicker";
import { Period } from "./interfaces";


const defaultPeriods : Period[] = [
  { name: "pre-school", color: "#bbd00d", start: new Date("1900-01-01"), end: new Date("1900-12-31") },
  { name: "middle-school", color: "#17810a", start: new Date("1901-01-01"), end: new Date("1901-12-31") },
  { name: "high-school", color: "#a4580b", start: new Date("1902-01-01"), end: new Date("1902-12-31") },
  { name: "college", color: "#45173b", start: new Date("1903-01-01"), end: new Date("1903-12-31") },
  ]

function FormView() {
  const [periods, setPeriods] = useState<Period[]>(defaultPeriods);
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
                </tr>
              </thead>
              <tbody>
                {
                  periods.map( ({name, start, end, color}, index) => {
                    return <TimeSlot position={index + 1} name={name} start={start} end={end} color={color} />
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
  start: Date;
  end: Date;
  color: string;
  position: number;
}


function TimeSlot({name, start, end, color, position } : TimeSlotInterface) {
  return (
      <tr className="p-2">
        <th>{position}</th>
        <td>{name}</td>
        <td>{start.toString()}</td>
        <td>{end.toString()}</td>
        <td>{color}</td>
      </tr>
    );
}



export default FormView;
