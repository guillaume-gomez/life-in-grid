import React, { useState } from "react";

interface TimeSlot {
  name: string;
  color: string;
  edit: boolean;
}

interface TimeSlotRowInterface {
  name: string;
  color: string;
  position: number;
  edit: boolean;
  onChange: (name: keyof TimeSlot, value: unknown) => void;
  onDelete: () => void;
}

const defaultTimeslots : TimeSlot[] = [
  { name: "pre-school", color: "#bbd00d", edit: false },
  { name: "middle-school", color: "#17810a", edit: false },
  { name: "high-school", color: "#a4580b", edit: false },
  { name: "college", color: "#45173b", edit: false },
];

interface TimeSlotsFormInterface {
  onSubmit?: (timeslots: TimeSlot[]) => void;
}

function TimeSlotsForm({ onSubmit } : TimeSlotsFormInterface) : React.ReactElement {
  const [timeslots, setTimeslots] = useState<TimeSlot[]>(defaultTimeslots);

  function onChangeItem(index: number, name: keyof TimeSlot, value: unknown) : void {
    if(name === "edit") {
      changeEdit(index, value as boolean);
      return;
    }

    const newTimeslots = timeslots.map((period, indexTimeslots) => {
      if(indexTimeslots === index) {
        return { ...period , [name]: value};
      }
      return period;
    });
    setTimeslots(newTimeslots);
  }

  function changeEdit(index: number, value: boolean) {
    const newTimeslots = timeslots.map((period, indexTimeslots) => {
      if(indexTimeslots === index) {
        return { ...period , edit: value };
      }
      return { ...period , edit: false };
    });
    setTimeslots(newTimeslots);
  }

  function addTimeslot() {
    const periodsInReadOnly = timeslots.map((period) => ({ ...period, edit: false }) );
    setTimeslots([...periodsInReadOnly, {name: "New timeslot", color: "red", edit: true }]);
  }

  function removeTimeslot(indexToDelete: number) {
    const newTimeslots = timeslots.filter((_period, index) => indexToDelete !== index);
    setTimeslots(newTimeslots);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <label className="label prose">
          <h2 className="label-text">Create your timeslots</h2>
        </label>
        <button className="btn btn-primary" onClick={addTimeslot}>Add TimeSlot</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full p-2 border rounded-lg shadow-2xl" style={{borderCollapse: "revert", borderColor: "hsl(var(--b1) / var(--tw-bg-opacity))"}}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Color</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              timeslots.map( ({name, color, edit}, index) => {
                return <TimeSlotRow
                  position={index + 1}
                  key={index}
                  name={name}
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

function TimeSlotRow({name, color, position, edit, onChange, onDelete } : TimeSlotRowInterface) {
  const editButton = <button className="btn btn-ghost" onClick={() => onChange("edit", !edit)}>✏️</button>;
  const trashButton = <button className="btn btn-ghost" onClick={onDelete}>🗑</button>;

  if(edit) {
    return (
      <tr className="active">
        <th className="w-1/12">{position}</th>
        <td className="w-3/12">
          <input className="input w-full max-w-xs" value={name} onChange={(event) => onChange("name", event.target.value)}/>
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
        <td className="w-1/12">
          <input disabled type="color" value={color}/>
        </td>
        <td className="w-1/12">
          {editButton}
        </td>
      </tr>
    );
}


export default TimeSlotsForm;
