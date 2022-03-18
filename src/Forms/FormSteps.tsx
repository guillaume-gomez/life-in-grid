import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import BirthdayForm from "./BirthdayForm";
import TimeSlotsForm from "./TimeSlotsForm";
import PeriodsForm from "./PeriodsForm";
import DataForm from "../reducers/useCreateLifeInGridReducer";

function FormSteps() {
  const { birthday, periods, timeSlots } = DataForm.useContainer();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const navigate = useNavigate();

  function isValid() : boolean {
    const invalidPeriods = periods.filter(period => period.start === "" || period.end === "");
    return birthday !== "" && periods.length > 0 && invalidPeriods.length === 0;
  }

  function validateBirthday() : boolean {
    return birthday != null && birthday !== "";
  }

  function validateTimeSlots() : boolean {
    return timeSlots.length !== 0;
  }

  function generate() {
    let params = new URLSearchParams();
    params.append("birthday", birthday);
    //const computedPeriods :Period[] = computePeriodsParam();

    const computedPeriods = periods.map(period => {
      const timeSlot = timeSlots.find(timeSlot => timeSlot.id === period.timeSlotId);
      const name = timeSlot?.name || "unexisting time slot";
      const color = timeSlot?.color || "#000000";
      const overlap = timeSlot?.overlap || false;
      const periodWithTimeSlot = { name, color, overlap, start: period.start, end: period.end };
      return periodWithTimeSlot;
    });
    params.append("period-length", computedPeriods.length.toString());

    computedPeriods.forEach((period, index) => {
      Object.entries(period).forEach(([key, value]) => {
        params.append(`periods[${index}][${key}]`, value.toString());
      })
    });
    navigate(`/?${params.toString()}`);
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
          {nextButtonFn(!validateBirthday())}
        </>
        );
      case 1:
        return (
        <>
          {previousButtonFn(false)}
          {nextButtonFn(!validateTimeSlots())}
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
      "TimeSlots 📊",
      "Periods 📅"
    ];
    return (
      <ul className="steps bg-neutral rounded-lg p-2">
        {
          steps.map((step, index) => <li key={step} className={`step ${index <= currentStep ? "step-primary" : ""}`}>{step}</li>)
        }
      </ul>
    );
  }



  return (
    <>
      {stepper()}
      <div className="flex flex-col gap-10 justify-center">
          { currentStep === 0 && <BirthdayForm />}
          { currentStep === 1 && <TimeSlotsForm />}
          { currentStep === 2 && <PeriodsForm />}
        <div className="card-actions justify-between">
          {manageButtons()}
        </div>
      </div>
    </>
  );
}


export default FormSteps;
