var canvas, ctx,
    brush = {
        x: 0,
        y: 0,
        color: '#000000',
        size: 10,
        down: false,
        eraser: false
    },
    strokes = [],
    currentStroke = null;

function redraw () {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineCap = 'round';
    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function init () {
    canvas = $('#draw');
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    ctx = canvas[0].getContext('2d');

    function mouseEvent (e) {
        brush.x = e.pageX;
        brush.y = e.pageY - 25;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });

        redraw();
    }

    canvas.mousedown(function (e) {
        brush.down = true;

        currentStroke = {
            color: brush.eraser ? '#EBECF0' : brush.color, // Set color based on eraser state
            size: brush.size,
            points: [],
        };

        strokes.push(currentStroke);

        mouseEvent(e);
    }).mouseup(function (e) {
        brush.down = false;

        mouseEvent(e);

        currentStroke = null;
    }).mousemove(function (e) {
        if (brush.down)
            mouseEvent(e);
    });

    $('#save-btn').click(function () {
        window.open(canvas[0].toDataURL());
    });

    $('#undo-btn').click(function () {
        strokes.pop();
        redraw();
    });

    $('#clear-btn').click(function () {
        strokes = [];
        redraw();
    });

    $('#color-picker').on('input', function () {
        brush.color = this.value;
    });

    $('#brush-size').on('input', function () {
        brush.size = this.value;
    });

    $(window).on('resize', function () {
        canvas.attr({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        redraw();
    });

    $('#eraser-checkbox').on('change', function () {
        brush.eraser = this.checked;
        if (brush.eraser) {
            brush.color = '#FFFFFF';       
        } else {
            brush.color = $('#color-picker').val();    
        }
    });

    $('#opacity-slider').on('input', function() {
        brush.color = updateColorOpacity($('#color-picker').val(), parseFloat(this.value));
      });

      $('#screenshot-btn').click(function() {
        downloadScreenshot();
      });

      canvas[0].addEventListener('touchstart', function (e) {
        brush.down = true;

        currentStroke = {
            color: brush.eraser ? '#EBECF0' : brush.color,
            size: brush.size,
            points: [],
        };

        strokes.push(currentStroke);

        touchEvent(e);
    });

    canvas[0].addEventListener('touchend', function (e) {
        brush.down = false;

        touchEvent(e);

        currentStroke = null;
    });

    canvas[0].addEventListener('touchmove', function (e) {
        if (brush.down)
            touchEvent(e);
    });
    

}


function touchEvent(e) {
    brush.x = e.touches[0].pageX;
    brush.y = e.touches[0].pageY;

    currentStroke.points.push({
        x: brush.x,
        y: brush.y,
    });

    redraw();
}

function updateColorOpacity(color, opacity) {
    const rgbMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  
    if (!rgbMatch) {
      // Invalid color, return the original color
      return color;
    }
  
    const r = parseInt(rgbMatch[1], 16);
    const g = parseInt(rgbMatch[2], 16);
    const b = parseInt(rgbMatch[3], 16);
  
    // Convert opacity to alpha value (range: 0 to 1)
    const alpha = Math.min(Math.max(opacity, 0), 1);
  
    // Return the updated color with opacity
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function downloadScreenshot() {
  
    const img = new Image();
  
    img.src = canvas[0].toDataURL();
  
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'screenshot.png';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
  }
  

$(init);