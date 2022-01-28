let canvas;
let context;

function onLoad() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  console.log(canvas)
  canvas.width = 1000;
  canvas.height = 500;



  drawSquare(context, "red", 100, 250);
  drawSquare(context, "red", 250, 250);
  drawSquare(context, "red", 400, 250);
}

function init() {
 
}

function drawSquare(context, color, x, y) {
  const width = 50;
  const height = 50;

  const innerRectWidth = 45;
  const innerRectHeight = 45;

  context.shadowBlur = 20;
  context.shadowColor = color;
  context.fillStyle = "rgba(255,255,255, 0.5)";
  context.fillRect(x, y, width, height);

  //context.shadowBlur = 0;
  context.fillStyle = "black";
  context.fillRect(x + (width - innerRectWidth)/2, y + (height - innerRectHeight)/2, innerRectWidth, innerRectHeight);

}

/*ctx[1].fillStyle = "black";
ctx[1].fillRect(0,0,200,200);
ctx[1].shadowBlur = 20;
ctx[1].shadowColor = "red";
ctx[1].fillRect(50,50,100,100);*/

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