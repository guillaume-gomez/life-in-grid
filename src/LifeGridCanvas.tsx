import React, { useRef, useEffect, useState } from 'react';
import { differenceInCalendarYears, differenceInCalendarISOWeeks, startOfYear, eachWeekOfInterval, isBefore, isAfter } from 'date-fns';


interface LifeGridCanvasProps {
  birthdayDate: Date;
  deathDate: Date;
}

function LifeGridCanvas({birthdayDate, deathDate} : LifeGridCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D>(null);
  useEffect(() => {
    if(ref.current) {
      const context = ref.current.getContext("2d");
      if(context) {
        init(context);
      }
    }
  }, [ref]);

  function computeColor(date: Date) : string {
    if(isBefore(date, birthdayDate)) {
      return "blue";
    }

    return "red";
  }

  function drawSquare(context: CanvasRenderingContext2D, color: string, x : number, y: number, width: number, height: number) {
    const innerRectWidth = width - 5;
    const innerRectHeight = height - 5;

    context.shadowBlur = 20;
    context.shadowColor = color;
    context.fillStyle = "rgba(255,255,255, 0.5)";
    context.fillRect(x, y, width, height);

    //context.shadowBlur = 5;
    context.fillStyle = "black";
    context.fillRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);

  }

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

    ref.current.width = maxRow * (width + offset);
    ref.current.height = (differenceInCalendarYears(weeksArray[weeksArray.length - 1], weeksArray[0]) +1) * (height + offset);

    let x = 0;
    let y = 0;
    let year = weeksArray[0].getFullYear();

    weeksArray.forEach(week => {
      if(year !== week.getFullYear()) {
        x = 0;
        y = y + 1;
        year = week.getFullYear();
      }
      drawSquare(context, computeColor(week), x * (width + offset), y * (height + offset), width, height);
      x++;
    })
  }


  return (
    <canvas ref={ref}></canvas>
  );
}

export default LifeGridCanvas;