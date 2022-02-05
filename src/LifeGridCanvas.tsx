import React, { useRef, useEffect, useState } from 'react';
import { differenceInCalendarISOWeeks, startOfYear } from 'date-fns';


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
    
    const weeks = differenceInCalendarISOWeeks(
      deathDate,
      birthdayDate
    );
    const offsetWeeks = differenceInCalendarISOWeeks(
      birthdayDate,
      startOfYearDate
    );
    const width = 20;
    const height = 20;
    const offset = 5;

    const row = 52;
    const column = Math.ceil(weeks / row);

    ref.current.width = row * (width + offset);
    ref.current.height = column * (height + offset);

    let x = 0;
    let y = 0;
    for(let week = 0; week < offsetWeeks; week++){
      drawSquare(context, "blue", x * (width + offset), y * (height + offset), width, height);
      x++;
    }
    
    for(let week = 0; week < weeks; week++){
      drawSquare(context, "red", x * (width + offset), y * (height + offset), width, height);
      x++;
      if(x !== 0 && x % row === 0) {
        x = 0;
        y = y + 1;
      }
    }
  }


  return (
    <canvas ref={ref}></canvas>
  );
}

export default LifeGridCanvas;