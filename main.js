let canvas;
let context;

const weeks = 52;


function onLoad() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");
  init(context);
}

function init(context) {
  const age = 90;
  const weeks = 52;

  const width = 20;
  const height = 20;
  const offset = 5;

  for(let x = 0; x < weeks ; x++ ) {
    for(let y = 0; y < age; y++ ) {
      drawSquare(context, "red", x * (width + offset), y * (height + offset), width, height);
    }
  }
}

function drawSquare(context, color, x, y, width, height) {
  const innerRectWidth = width - 5;
  const innerRectHeight = height - 5;

  context.shadowBlur = 20;
  context.shadowColor = color;
  context.fillStyle = "rgba(255,255,255, 0.5)";
  context.fillRect(x, y, width, height);

  //context.shadowBlur = 0;
  context.fillStyle = "black";
  context.fillRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);

}

window.onload = onLoad;
window.onresize = init;
window.addEventListener('dblclick', () =>
{
    if(!canvas) {
        return;
    }

    if(!document.fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        
    }
});