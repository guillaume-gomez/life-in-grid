import React, { useRef, useEffect, useMemo } from 'react';
import { differenceInCalendarYears, startOfYear, eachWeekOfInterval, isBefore, isAfter } from 'date-fns';
import useAnimationFrame from "./useAnimationFrame";

interface Period {
  name: string;
  color: string;
  start: Date;
  end: Date;
}

interface RenderData {
  color: string;
  x : number;
  y: number;
  width: number;
  height: number;
}

interface LifeGridCanvasProps {
  birthdayDate: Date;
  deathDate: Date;
  periods: Period[];
}

function LifeGridCanvas({ birthdayDate, deathDate, periods } : LifeGridCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const offsetShadowRef = useRef<number>(0.5);
  const shadowBlurRef = useRef<number>(20);
  useEffect(() => {
    if(ref.current) {
      const context = ref.current.getContext("2d");
      console.log("here")
      if(context) {
        init(context);
        render(context, shadowBlurRef.current);
      }
    }
  }, [ref, init]);
  const renderDataMemoized = useMemo(() => { return generateData(periods) }, [periods]);
  console.log(renderDataMemoized)

  useAnimationFrame((deltaTime: number) => {
    if(!ref.current) {
      return;
    }
    const context = ref.current.getContext("2d");
    if(context) {
      shadowBlurRef.current += offsetShadowRef.current * deltaTime;
      if(shadowBlurRef.current > 15 || shadowBlurRef.current < 1){
        offsetShadowRef.current *= -1;
      }
      context.clearRect(0, 0, ref.current.width, ref.current.height);
      render(context, shadowBlurRef.current);
    }
  });

  function computeColor(date: Date) : string {
    if(isBefore(date, birthdayDate)) {
      return "blue";
    }

    const periodFound = periods.find(period => isAfter(date, period.start) && isBefore(date, period.end));
    if(periodFound) {
      return periodFound.color;
    }

    return "red";
  }

  function generateData(periods: Period[]) {
    const startOfYearDate = startOfYear(birthdayDate);
    const weeksArray = eachWeekOfInterval({
      start:startOfYearDate,
      end: deathDate
    });

    const width = 20;
    const height = 20;
    const offset = 5;
    const maxRow = 53;

    
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
        { color: computeColor(week), x : x * (width + offset), y: y * (height + offset), width, height }
      );
      x++;
    });
    return renderData;
  }

  function render(context: CanvasRenderingContext2D, opacity: number) {
    renderDataMemoized.forEach(renderData => {
      // TODO
      // render and build square separately to avoid to recreate context each times
      drawSquare(context, renderData, opacity);
    });
  }


  function drawSquare(context: CanvasRenderingContext2D, { color, x , y, width, height} : RenderData, shadowBlur: number) {
      const innerRectWidth = width - 5;
      const innerRectHeight = height - 5;

    context.save();

    //context.shadowBlur = shadowBlur;
    //context.shadowColor = color;
    context.fillStyle = color;//"rgba(255,255,255, 0.5)";
    context.fillRect(x, y, width, height);

    //context.shadowBlur = 5;
    context.fillStyle = "black";
    context.fillRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);

    context.restore();
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

    generateData(periods);
  }


  return (
    <canvas ref={ref}></canvas>
  );
}

export default LifeGridCanvas;