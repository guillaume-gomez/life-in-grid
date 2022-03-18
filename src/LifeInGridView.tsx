import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from "react-router-dom";
import LifeGridCanvas from "./Components/LifeGridCanvas";
import Legend from "./Components/Legend";

import { parseArrayKey, is2dimArrayKey } from "./queryStringHelper";
import { Period } from "./interfaces";

const deathAge = 90;
const myPeriods : Period[] = [
  { name: "pre-school", color: "#af1414", start: new Date("1995-09-01"), end: new Date("1998-06-01"), overlap: false },
  { name: "middle-school", color: "#17810a", start: new Date("1998-09-01"), end: new Date("2003-06-01"), overlap: false },
  { name: "high-school", color: "#a4580b", start: new Date("2003-09-01"), end: new Date("2007-06-01"), overlap: false },
  { name: "college", color: "#45173b", start: new Date("2007-09-01"), end: new Date("2010-06-01"), overlap: false },
  { name: "IT-schools", color: "#dc6cc3", start: new Date("2010-09-01"), end: new Date("2015-06-01"), overlap: false },
  { name: "Applidget", color: "#35986f", start: new Date("2015-08-01"), end: new Date("2017-11-01"), overlap: false },
  { name: "Amuse", color: "#F109F9", start: new Date("2017-11-01"), end: new Date("2021-12-15"), overlap: false },
  { name: "Ecotree", color: "#131963", start: new Date("2022-01-03"), end: new Date("2022-03-13"), overlap: false },
  { name: "WoldCup", color: "#50FF50", start: new Date("1998-06-01"), end: new Date("1998-07-17"), overlap: true },
  { name: "WoldCup", color: "#50FF50", start: new Date("2002-06-01"), end: new Date("2002-07-17"), overlap: true },
  { name: "WoldCup", color: "#50FF50", start: new Date("2006-06-01"), end: new Date("2006-07-17"), overlap: true },
]

function LifeInGridView() {
  // february is 1 for month number.
  const [birthday, setBirthday] = useState<Date>(new Date(1992, 1, 2));
  const [periods, setPeriods] = useState<Period[]>(myPeriods);
  const [forecastDeath] = useState<Date>(new Date(1992 + deathAge, 1, 2));
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [showAxis, setShowAxis] = useState<boolean>(false);
  const [params] = useSearchParams();

  useEffect(() => {
    const periodLength = params.get("period-length");
    if(!periodLength) {
      return;
    }
    const periodsArray : Period[] = Array(parseInt(periodLength)).fill(0).map((_val , index) => {
      return { name: index.toString(), color: "#131963", start: new Date(), end: new Date(), overlap: false }
    })
    let queryStringObject : any = { birthday: "", periods: periodsArray };
    for(let pair of Array.from(params.entries())) {
      if(is2dimArrayKey(pair[0])) {
        const [key, index, field] = parseArrayKey(pair[0]);
        queryStringObject[key][index][field] = pair[1];
      } else {
        queryStringObject[pair[0]] = pair[1];
      }
    }

    setBirthday(new Date(queryStringObject.birthday));
    setPeriods(queryStringObject.periods.map((period: any)=>sanitizePeriodPayload(period)));
  }, [params])

  function sanitizePeriodPayload(payloadPeriod: any ) : Period {
    return {
      name: payloadPeriod.name,
      color: payloadPeriod.color,
      start: new Date(payloadPeriod.start),
      end: new Date(payloadPeriod.end),
      overlap: (payloadPeriod.overlap === "true") || false
    }
  }

  function selectedPeriodCallback(periodName: string) {
    if(selectedPeriod === periodName) {
      setSelectedPeriod("");
    } else {
     setSelectedPeriod(periodName);
    }
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-5">
        <div className="md:w-3/12 flex flex-col gap-3">
          <Legend
            selectedPeriod={selectedPeriod}
            selectedPeriodCallback={selectedPeriodCallback}
            periods={periods}
            showAxis={showAxis}
            showAxisCallback={() => setShowAxis(!showAxis) }
          />
          <Link to="/create" className="link">Create your own life in grid</Link>
        </div>
        <div className="md:w-9/12">
          <LifeGridCanvas
            showAxis={showAxis}
            deathDate={forecastDeath}
            birthdayDate={birthday}
            periods={periods}
            selectedPeriod={selectedPeriod}
          />
        </div>
    </div>
  );
}

export default LifeInGridView;
