import React, { useRef, useEffect, useState } from 'react';

function CustomCanvas() {
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
    const age = 90;
    const weeks = 52;

    const width = 20;
    const height = 20;
    const offset = 5;

    ref.current.width = weeks * (width + offset);
    ref.current.height = age * (height + offset);

    for(let x = 0; x < weeks ; x++ ) {
      for(let y = 0; y < age; y++ ) {
        drawSquare(context, "red", x * (width + offset), y * (height + offset), width, height);
      }
    }
  }


  return (
    <canvas ref={ref}></canvas>
  );
}

export default CustomCanvas;