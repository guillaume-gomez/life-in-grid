import React, { useRef, useEffect, useMemo } from 'react';
import { differenceInCalendarYears, startOfYear, eachWeekOfInterval, isBefore, isAfter } from 'date-fns';
import { Period } from "./interfaces";

interface RenderData {
  color: string;
  x : number;
  y: number;
  width: number;
  height: number;
  name: string;
}

interface LifeGridCanvasProps {
  birthdayDate: Date;
  deathDate: Date;
  periods: Period[];
  selectedPeriod: string;
}

function LifeGridCanvas({ birthdayDate, deathDate, periods, selectedPeriod } : LifeGridCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function init(context: CanvasRenderingContext2D) {
      if(!ref.current) {
        return;
      }
      const startOfYearDate = startOfYear(birthdayDate);
      const weeksArray = eachWeekOfInterval({
        start:startOfYearDate,
        end: deathDate
      });

      const width = 20;
      const height = 20;
      const offset = 5;
      const maxRow = 53;
      const padding = 40;

      ref.current.width =  padding + maxRow * (width + offset);
      ref.current.height = padding + (differenceInCalendarYears(weeksArray[weeksArray.length - 1], weeksArray[0]) + 1) * (height + offset);
    }

    if(ref.current) {
      const context = ref.current.getContext("2d");
      if(context) {
        init(context);
        render(context);
      }
    }

  }, [ref, birthdayDate, deathDate, selectedPeriod]);

  const renderDataMemoized = useMemo(() => {
    function generateData(periods: Period[]) {
      const startOfYearDate = startOfYear(birthdayDate);
      const weeksArray = eachWeekOfInterval({
        start:startOfYearDate,
        end: deathDate
      });

      const width = 20;
      const height = 20;
      const offset = 5;
      const padding = 40;
      const halfPadding = padding/2;

      let x = 0;
      let y = 0;
      let year = weeksArray[0].getFullYear();
      let renderData : RenderData[] = [];

      weeksArray.forEach(week => {
        if(year !== week.getFullYear()) {
          x = 0;
          y = y + 1;
          year = week.getFullYear();
        }
        renderData.push(
          { 
            color: computeColor(week),
            name: computeName(week),
            x : halfPadding + x * (width + offset),
            y:  halfPadding + y * (height + offset),
            width,
            height,
          }
        );
        x++;
      });
      return renderData;
    }


    return generateData(periods)
  }, [periods]);

  function computeName(date: Date) : string {
    const periodFound = periods.find(period => isAfter(date, period.start) && isBefore(date, period.end));
    if(periodFound) {
      return periodFound.name;
    }
    return "none";
  }
  
  function computeColor(date: Date) : string {
    if(isBefore(date, birthdayDate)) {
      return "blue";
    }

    const periodFound = periods.find(period => isAfter(date, period.start) && isBefore(date, period.end));
    if(periodFound) {
      return periodFound.color;
    }

    return "grey";
  }

  function render(context: CanvasRenderingContext2D) {
    let currentColor : string = "FFFFFF";
    renderDataMemoized.forEach(renderData => {
      if(currentColor !== renderData.color) {
        context.shadowColor = renderData.color;
        context.shadowBlur = 10;
        context.lineJoin = 'bevel';
        context.lineWidth = 4;
        context.strokeStyle = renderData.color;
        currentColor = renderData.color;
      }
      drawSquare(context, renderData, renderData.name === selectedPeriod);
    });
  }


  function drawSquare(context: CanvasRenderingContext2D, { color, x , y, width, height} : RenderData, selected: boolean) {
    const offset = selected ? 1 : 5
    const innerRectWidth = width - offset;
    const innerRectHeight = height - offset;
    context.strokeRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);
  }

  return (
    <canvas className="w-full bg-black rounded-2xl" id="custom-canvas" ref={ref}></canvas>
  );
}

export default LifeGridCanvas;