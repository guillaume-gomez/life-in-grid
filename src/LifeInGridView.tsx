import React, { useState } from 'react';
import LifeGridCanvas from "./LifeGridCanvas";
import Legend from "./Legend";

const deathAge = 80;
const periods = [
  { name: "pre-school", color: "#bbd00d", start: new Date("1995-09-01"), end: new Date("1998-06-01") },
  { name: "middle-school", color: "#17810a", start: new Date("1998-09-01"), end: new Date("2003-06-01") },
  { name: "high-school", color: "#a4580b", start: new Date("2003-09-01"), end: new Date("2007-06-01") },
  { name: "college", color: "#45173b", start: new Date("2007-09-01"), end: new Date("2010-06-01") },
  { name: "IT-schools", color: "#dc6cc3", start: new Date("2010-09-01"), end: new Date("2015-06-01") },
  { name: "Applidget", color: "#35986f", start: new Date("2015-08-01"), end: new Date("2017-11-01") },
  { name: "Amuse", color: "#F109F9", start: new Date("2017-11-01"), end: new Date("2021-12-15") },
  { name: "Ecotree", color: "#131963", start: new Date("2022-01-03"), end: new Date("2022-02-22") },
]

function LifeInGridView() {
  // february is 1 for month number.
  const [birthday] = useState<Date>(new Date(1992, 1, 2));
  const [forecastDeath] = useState<Date>(new Date(1992 + deathAge, 1, 2));
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  function selectedPeriodCallback(periodName: string) {
    if(selectedPeriod === periodName) {
      setSelectedPeriod("");
    } else {
     setSelectedPeriod(periodName);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 p-2">
        <Legend selectedPeriod={selectedPeriod} selectedPeriodCallback={selectedPeriodCallback} periods={periods} />
        <LifeGridCanvas deathDate={forecastDeath} birthdayDate={birthday} periods={periods} selectedPeriod={selectedPeriod} />
    </div>
  );
}

export default LifeInGridView;
