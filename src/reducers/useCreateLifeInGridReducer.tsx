import { useState, useEffect } from "react";
import { uniqueId } from "lodash";
import { createContainer } from "unstated-next";
import { useSearchParams } from "react-router-dom";
import { parseParams } from "../queryStringHelper";
import { PeriodFormInterface, TimeSlotFormInterface } from "../interfaces";


interface stateInterface {
  birthday: string;
  periods: PeriodFormInterface[];
  timeSlots: TimeSlotFormInterface[];
}

const defaultTimeSlots : TimeSlotFormInterface[] = [
  { id: uniqueId(), name: "pre-school", color: "#bbd00d", edit: false, overlap: false },
  { id: uniqueId(), name: "middle-school", color: "#17810a", edit: false, overlap: false },
  { id: uniqueId(), name: "high-school", color: "#a4580b", edit: false, overlap: false },
  { id: uniqueId(), name: "college", color: "#45173b", edit: false, overlap: false },
];

const initialState : stateInterface = {
  birthday: "2000-01-01",
  timeSlots: defaultTimeSlots,
  periods: []
}

function useCreateLifeInGridReducer(state = initialState) {
  const [birthday, setBirthday] = useState<string>(state.birthday);
  const [timeSlots, setTimeSlots] = useState<TimeSlotFormInterface[]>(state.timeSlots);
  const [periods, setPeriods] = useState<PeriodFormInterface[]>([]);
  const [params] = useSearchParams();

  // when birthday is set (first step) create a first period based on it.
  useEffect(() => {
    if(periods.length === 0) {
      setPeriods([
        {timeSlotId: state.timeSlots[0].id, start: birthday, end: birthday, edit: true}
      ]);
    }
  }, [birthday, periods.length, state.timeSlots]);

  useEffect(()=> {
    const periodLength = params.get("period-length");
    if(!periodLength) {
      return;
    }
    const queryStringObject = parseParams(params, parseInt(periodLength));
    let newPeriods : PeriodFormInterface[] = [];
    let newTimeSlots : TimeSlotFormInterface[] = [];

    queryStringObject.periods.forEach(periodParams => {
      let foundPeriod = newTimeSlots.find(timeSlot => timeSlot.name === periodParams.name );
      if(!foundPeriod) {
        foundPeriod = { id: (newTimeSlots.length + 1).toString(), name: periodParams.name, color: periodParams.color, overlap: periodParams.overlap, edit: false };
        newTimeSlots = [
          ...newTimeSlots,
          foundPeriod
        ];
      }
      newPeriods = [
        ...newPeriods,
        { timeSlotId: foundPeriod.id, start: periodParams.start.toString(), end: periodParams.end.toString(), edit: false }
      ];
    });

    setBirthday(queryStringObject.birthday);
    setPeriods(newPeriods);
    setTimeSlots(newTimeSlots);

  }, [params]);

  function addTimeSlot() {
    const timeSlotsInReadOnly = timeSlots.map((timeSlot) => ({ ...timeSlot, edit: false }) );
    setTimeSlots([
      ...timeSlotsInReadOnly,
      { id: uniqueId(), name: "new time slot ...", color: "#FF0000", edit: false, overlap: false }
      ]
    );
  }

  function removeTimeSlot(id: string) {
    const newTimeslots = timeSlots.filter((period) => id !== period.id);
    setTimeSlots(newTimeslots);
  }

  function onChangeTimeSlot(id: string, name: keyof TimeSlotFormInterface, value: unknown) : void {
    if(name === "edit") {
      toggleTimeSlot(id, value as boolean);
      return;
    }

    const newTimeSlots = timeSlots.map((timeSlot) => {
      if(id === timeSlot.id) {
        return { ...timeSlot , [name]: value};
      }
      return timeSlot;
    });
    setTimeSlots(newTimeSlots);
  }

  function toggleTimeSlot(id: string, value: boolean) {
    const newTimeSlots = timeSlots.map((timeSlot) => {
      if(id === timeSlot.id) {
        return { ...timeSlot , edit: value };
      }
      return { ...timeSlot , edit: false };
    });
    setTimeSlots(newTimeSlots);
  }

  function onChangePeriod(index: number, name: keyof PeriodFormInterface, value: unknown) : void {
    if(name === "edit") {
      togglePeriod(index, value as boolean);
      return;
    }
    const newPeriods = periods.map((period, indexPeriod) => {
      if(indexPeriod === index) {
        if(name === "start") {
          return { ...period , end: (value as string), [name]: (value as string)};
        } else {
          return { ...period , [name]: value};
        }
      }
      return period;
    });
    setPeriods(newPeriods);
  }

  function togglePeriod(index: number, value: boolean) {
    const newPeriods = periods.map((period, indexPeriod) => {
      if(indexPeriod === index) {
        return { ...period , edit: value };
      }
      return { ...period , edit: false };
    });
    setPeriods(newPeriods);
  }

  function addPeriod() {
    const periodsInReadOnly = periods.map((period) => ({ ...period, edit: false }) );
    setPeriods([
      ...periodsInReadOnly,
      { timeSlotId: timeSlots[0].id, start: birthday, end: birthday, edit: true }
    ]);
  }

  function removePeriod(indexToDelete: number) {
    const newPeriods = periods.filter((_period, index) => indexToDelete !== index);
    setPeriods(newPeriods);
  }




  return {
    birthday,
    setBirthday,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    onChangeTimeSlot,
    periods,
    addPeriod,
    removePeriod,
    onChangePeriod
  }
}

export default createContainer(useCreateLifeInGridReducer);