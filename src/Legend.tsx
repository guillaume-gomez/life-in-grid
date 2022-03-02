import React from "react";
import { Period } from "./interfaces";

interface LegendInterface {
    periods: Period[];
    selectedPeriodCallback: (periodName: string) => void;
}

function Legend({ periods, selectedPeriodCallback } : LegendInterface) : React.ReactElement {
    return(
        <div className="card w-full bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Legend</h2>
            <div className="flex flex-wrap gap-3">
                {
                    periods.map(period => {
                        return (
                            <button className="btn btn-active btn-ghost" onClick={() => selectedPeriodCallback(period.name)}>
                                <div className="flex gap-2 justify-center items-center">
                                    <div className="w-6 h-6 rounded" style={{backgroundColor: period.color}}></div>
                                    {period.name}
                                </div>
                            </button>
                        );
                    })
                }
            </div>
          </div>
        </div>
    );
}

export default Legend;
