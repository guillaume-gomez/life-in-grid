import React, { useMemo } from "react";
import { Period } from "../interfaces";
import { UndefinedColor, BeforeBirthdayColor } from "../Constants";

interface LegendInterface {
    periods: Period[];
    selectedPeriod: string;
    selectedPeriodCallback: (periodName: string) => void;
    showAxis: boolean;
    showAxisCallback: () => void;
}

interface UniqLegendDateInterface {
    start: Date;
    end: Date;
}

interface UniqLegendDataInterface {
    color: string;
    dates: UniqLegendDateInterface[];
}

interface UniqLegendsInterface {
    [key: string]: UniqLegendDataInterface;
}

function Legend({ periods, selectedPeriodCallback, selectedPeriod, showAxis, showAxisCallback } : LegendInterface) : React.ReactElement {
    const uniqLegends = useMemo(() => {
        return periods.reduce(
            (accumulator : UniqLegendsInterface, current: any) => {
                const newSlot = {start: current.start, end: current.end };
                if(accumulator[current.name]) {
                    const dates = accumulator[current.name].dates;
                    return {
                        ...accumulator,
                        [current.name]: { dates: [...dates, newSlot], color: current.color }
                    }
                } else {
                    return {
                        ...accumulator,
                        [current.name]: { dates: [newSlot], color: current.color }
                    }
                }
            }
        , {});
    }, [periods]);

    const uniqLegendsArray : Array<[name: string, value: UniqLegendDataInterface]> = Object.entries(uniqLegends);
    return(
        <div className="card w-full bg-base-300 shadow-xl">
          <div className="card-body overflow-auto">
            <h2 className="card-title">Legend</h2>
            <div className="flex flex-wrap gap-3">
                <LegendButton
                      name="Before Birthday"
                      color={BeforeBirthdayColor}
                      dates={[]}
                      disabled={false}
                      selected={false}
                />
                <LegendButton
                    name="Unset"
                    color={UndefinedColor}
                    dates={[]}
                    disabled={false}
                    selected={false}
                />
                {
                    uniqLegendsArray.map(([name, value]) => 
                      <LegendButton
                          name={name}
                          color={value.color}
                          dates={value.dates}
                          disabled={false}
                          selected={ name === selectedPeriod}
                          selectedPeriodCallback={selectedPeriodCallback}
                      />
                    )
                }
            </div>
            <div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Show Axis <span>(X: Weeks / Y: Years)</span></span>
                    <input type="checkbox" checked={showAxis} onClick={showAxisCallback} className="toggle"/>
                  </label>
                </div>
            </div>
          </div>
        </div>
    );
}

interface LegendButtonInterface {
    name: string;
    color: string;
    dates: UniqLegendDateInterface[];
    disabled: boolean;
    selected: boolean;
    selectedPeriodCallback?: (name: string) => void;
}

function LegendButton({name, color, dates, disabled, selected, selectedPeriodCallback }: LegendButtonInterface) : React.ReactElement {
    return(
    <button
        disabled={disabled}
        key={name}
        style={{ height: "max-content" }}
        className={ selected ? "btn btn-primary" :"btn btn-ghost"}
        onClick={() => selectedPeriodCallback && selectedPeriodCallback(name)}
    >
        <div className="flex flex-col">
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded" style={{backgroundColor: color}}></div>
                <span>{name}</span>
            </div>
            {
                dates.map((date, index) =>
                    <span key={index} className="text-xs">{date.start.toDateString()} - {date.end.toDateString()}</span>
                )
            }
        </div>
    </button>
   )
}

export default Legend;