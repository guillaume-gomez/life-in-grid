import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import DatePicker from "./Components/DatePicker";
import { Period } from "./interfaces";
import BirthdayForm from "./BirthdayForm";
import TimeSlotsForm from "./TimeSlotsForm";

interface PeriodForm extends Omit<Period, 'start' | 'end'> {
  edit: boolean;
  start: string;
  end: string;
}

const defaultPeriods : PeriodForm[] = [
  { name: "pre-school", color: "#bbd00d", start: "1990-01-10", end: "1990-12-31", edit: false },
  { name: "middle-school", color: "#17810a", start: "1991-01-01", end: "1991-12-31", edit: false },
  { name: "high-school", color: "#a4580b", start: "1992-01-01", end: "1992-12-31", edit: false },
  { name: "college", color: "#45173b", start: "1993-01-01", end: "1993-12-31", edit: false },
];

function FormView() {
  const [periods, setPeriods] = useState<PeriodForm[]>(defaultPeriods);
  const [birthday, setBirthday] = useState<string>(Date.now().toString());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const navigate = useNavigate();

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

  function generate() {
    let params = new URLSearchParams();
    params.append("birthday", birthday);
    params.append("period-length", periods.length.toString());
    periods.forEach((period, index) => {
      Object.entries(period).forEach(([key, value]) => {
        params.append(`periods[${index}][${key}]`, value.toString());
      })
    });
    navigate(`/?${params.toString()}`);
  }

  function timeslotDurationForm() {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="label prose">
            <h2 className="label-text">Create your periods</h2>
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
    );
  }

  function manageButtons() {
    const previousButtonFn = (disabled: boolean) => <button disabled={disabled} className="btn btn-primary" onClick={()=> setCurrentStep(currentStep - 1)}>⬅️ Previous</button>
    const nextButtonFn = (disabled: boolean) => <button disabled={disabled} className="btn btn-primary" onClick={()=> setCurrentStep(currentStep + 1)}>Next ➡️</button>
    const generateButton = <button className="btn btn-primary" disabled={!isValid()} onClick={generate}>Generate 🚀</button>;

    switch(currentStep) {
      case 0:
        return (
        <>
          {previousButtonFn(true)}
          {nextButtonFn(false)}
        </>
        );
      case 1:
        return (
        <>
          {previousButtonFn(false)}
          {nextButtonFn(false)}
        </>
        );
      case 2:
      default:
        return (
        <>
          {previousButtonFn(false)}
          {generateButton}
        </>
        );
    }
  }

  function stepper() {
    const steps : string[] = [
      "Birthday 🎂",
      "TimeSlot 📊",
      "TimeSlot Durations 📅"
    ];
    return (
      <ul className="steps bg-accent">
        {
          steps.map((step, index) => <li key={step} className={`step ${index <= currentStep ? "step-primary" : ""}`}>{step}</li>)
        }
      </ul>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="card md:w-9/12 bg-base-300 shadow-xl">
        <div className="card-body gap-7 justify-center">
          <h2 className="card-title">Create your life grid</h2>
          {stepper()}
          <div className="flex flex-col gap-10 justify-center">
            { currentStep === 0 && <BirthdayForm birthday={birthday} onChange={(date) => setBirthday(date)} />}
            { currentStep === 1 && <TimeSlotsForm />}
            { currentStep === 2 && timeslotDurationForm()}
            <div className="card-actions justify-between">
              {manageButtons()}
            </div>
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
