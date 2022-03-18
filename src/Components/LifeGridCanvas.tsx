import React, { useRef, useEffect, useMemo } from 'react';
import { differenceInCalendarYears, startOfYear, eachWeekOfInterval, isBefore, isAfter } from 'date-fns';
import { range } from "lodash";
import { Period } from "../interfaces";
import { UndefinedColor, BeforeBirthdayColor } from "../Constants";

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
  showAxis: boolean;
}

const WIDTH = 20;
const HEIGHT = 20;
const OFFSET = 5;
const PADDING = 40;
const HALF_PADDING = PADDING/2;
const PADDING_AXIS = 40;
const HALF_PADDING_AXIS = PADDING_AXIS/2;
const MAX_ROW = 53;

function LifeGridCanvas({ birthdayDate, deathDate, periods, selectedPeriod, showAxis } : LifeGridCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  console.log(periods)
  useEffect(() => {
    function init(context: CanvasRenderingContext2D, showAxis: boolean) {
      if(!ref.current) {
        return;
      }
      const startOfYearDate = startOfYear(birthdayDate);
      const weeksArray = eachWeekOfInterval({
        start:startOfYearDate,
        end: deathDate
      });

      const paddingAxis = showAxis ? PADDING_AXIS : 0;
      ref.current.width =  PADDING + paddingAxis + MAX_ROW * (WIDTH + OFFSET);
      ref.current.height = PADDING + paddingAxis + (differenceInCalendarYears(weeksArray[weeksArray.length - 1], weeksArray[0]) + 1) * (HEIGHT + OFFSET);
    }

    if(ref.current) {
      const context = ref.current.getContext("2d");
      if(context) {
          init(context, showAxis);
          if(showAxis) {
            context.font = 'bold 22px Arial';
            context.fillStyle = "white"
            context.strokeStyle = "white";
            const magicOffset = 17;
            context.save();
            context.translate(PADDING_AXIS + OFFSET, HALF_PADDING_AXIS);
              renderWeeksAxis(context, magicOffset);
            context.restore();
            context.save();
            context.translate(HALF_PADDING_AXIS - OFFSET, PADDING_AXIS + PADDING_AXIS + 2*OFFSET);
              renderAgesAxis(context, magicOffset)
            context.restore();
            context.save()
            context.translate(HALF_PADDING + OFFSET, HALF_PADDING);
              render(context);
            context.restore();
          } else {
            render(context);
          }
      }
    }

  }, [ref, birthdayDate, deathDate, selectedPeriod, showAxis]);

  const renderDataMemoized = useMemo(() => {
    function generateData(periods: Period[]) {
      const startOfYearDate = startOfYear(birthdayDate);
      const weeksArray = eachWeekOfInterval({
        start:startOfYearDate,
        end: deathDate
      });

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
            x : HALF_PADDING + x * (WIDTH + OFFSET),
            y:  HALF_PADDING + y * (HEIGHT + OFFSET),
            width: WIDTH,
            height: HEIGHT,
          }
        );
        x++;
      });
      return renderData;
    }


    return generateData(periods)
  }, [periods]);

  function computeName(date: Date) : string {
    const periodsFound = periods.filter(period => isAfter(date, period.start) && isBefore(date, period.end));
    if(periodsFound.length >= 1) {
      const periodFound = periodsFound.find(period => period.overlap === true);
      if(periodFound) {
        return periodFound.name;
      } else {
        return periodsFound[0].name;
      }
    }
    return "none";
  }
  
  function computeColor(date: Date) : string {
    if(isBefore(date, birthdayDate)) {
      return BeforeBirthdayColor;
    }

    const periodsFound = periods.filter(period => (isAfter(date, period.start) && isBefore(date, period.end)));
    if(periodsFound.length >= 1) {
      const periodFound = periodsFound.find(period => period.overlap === true);
      if(periodFound) {
        return periodFound.color;
      } else {
        return periodsFound[0].color;
      }
    }

    return UndefinedColor;
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

  function renderAgesAxis(context: CanvasRenderingContext2D, magicOffset: number) {
    [0, 1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90].forEach((number) => {
      //context.strokeRect(0, (index) * (HEIGHT + OFFSET), WIDTH, HEIGHT);
      const numberString = number.toString();
      const textWidth = context.measureText(numberString).width;
      context.fillText(number.toString(), 0, magicOffset + (number-1) * (HEIGHT + OFFSET));
    })
  }

  function renderWeeksAxis(context: CanvasRenderingContext2D, magicOffset: number) {
    [1,5,10,15,20,25,30,35,40,45,50,53].forEach((number, index) => {
      //context.strokeRect((index) * (WIDTH + OFFSET), 0, WIDTH, HEIGHT);
      const numberString = number.toString();
      const textWidth = context.measureText(numberString).width;
      context.fillText(number.toString(), (number -1) * (WIDTH + OFFSET),  magicOffset);
    })
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