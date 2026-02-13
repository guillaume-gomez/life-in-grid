import React, { useRef } from "react";
import useResizeTable from "../CustomHooks/useResizeTable";
import DataForm from "../reducers/useCreateLifeInGridReducer";

interface TimeSlotRowInterface {
  name: string;
  color: string;
  id: string;
  edit: boolean;
  overlap: boolean;
}

function TimeSlotsForm() : React.ReactElement {
  const { timeSlots, addTimeSlot } = DataForm.useContainer();
  const tableRef = useRef<HTMLTableElement>(null);
  useResizeTable(tableRef);

  return (
    <div className="bg-neutral rounded-lg p-5 flex flex-col gap-2">
      <div className="flex justify-between">
        <label className="label prose">
          <h2 className="label-text">Create your timeslots</h2>
        </label>
        <button className="btn btn-primary" onClick={addTimeSlot}>Add TimeSlot</button>
      </div>
      <div className="overflow-x-auto">
        <table 
          ref={tableRef}
          className="table w-full"
          style={{borderCollapse: "revert", borderColor: "hsl(var(--b1) / var(--tw-bg-opacity))"}}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Color</th>
              <th>Overlap</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              timeSlots.map( ({id, name, color, edit, overlap}) => {
                return <TimeSlotRow
                  id={id}
                  key={id}
                  name={name}
                  color={color}
                  overlap={overlap}
                  edit={edit}
                  />
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimeSlotRow({name, color, id, edit, overlap } : TimeSlotRowInterface) {
  const { onChangeTimeSlot, removeTimeSlot } = DataForm.useContainer();
  const editButton = <button className="btn btn-ghost" onClick={() => onChangeTimeSlot(id, "edit", !edit)}>✏️</button>;
  const trashButton = <button className="btn btn-ghost" onClick={() => removeTimeSlot(id)}>🗑</button>;

  if(edit) {
    return (
      <tr className="active">
        <th className="">{id}</th>
        <td className="">
          <input className="input w-full max-w-xs" value={name} onChange={(event) => onChangeTimeSlot(id, "name", event.target.value)}/>
        </td>
        <td className="">
          <input type="color" value={color} onChange={(event) => onChangeTimeSlot(id, "color", event.target.value)}/>
        </td>
        <td className="">
          <input className="toggle" type="checkbox" checked={overlap} onChange={(event) => onChangeTimeSlot(id, "overlap", !overlap)}/>
        </td>
        <td className="">
          {editButton}
          {trashButton}
        </td>
      </tr>
    );
  }


  return (
      <tr onClick={()=> onChangeTimeSlot(id, "edit", true)}>
        <th className="">{id}</th>
        <td className="">{name}</td>
        <td className="">
          <input disabled type="color" value={color}/>
        </td>
        <td className="">{overlap.toString()}</td>
        <td className="">
          {editButton}
        </td>
      </tr>
    );
}


export default TimeSlotsForm;
