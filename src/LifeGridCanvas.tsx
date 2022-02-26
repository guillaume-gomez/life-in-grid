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
      }
    }

  }, [ref, birthdayDate, deathDate]);

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
          { color: computeColor(week), x : halfPadding + x * (width + offset), y:  halfPadding + y * (height + offset), width, height }
        );
        x++;
      });
      return renderData;
    }


    return generateData(periods)
  }, [periods]);
  
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

  function render(context: CanvasRenderingContext2D, opacity: number) {
    let currentColor : string = "FFFFFF";
    renderDataMemoized.forEach(renderData => {
      if(currentColor !== renderData.color) {
        //context.shadowColor = renderData.color;
        //context.shadowBlur = 20;
        context.lineJoin = 'bevel';
        context.lineWidth = 4;
        context.strokeStyle = renderData.color;

        currentColor = renderData.color;
      }
      drawSquare(context, renderData, opacity);
    });
  }


  function drawSquare(context: CanvasRenderingContext2D, { color, x , y, width, height} : RenderData, shadowBlur: number) {
    const innerRectWidth = width - 5;
    const innerRectHeight = height - 5;
    context.strokeRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);
  }

  return (
    <canvas className="w-10/12 bg-black" id="custom-canvas" ref={ref}></canvas>
  );
}

export default LifeGridCanvas;