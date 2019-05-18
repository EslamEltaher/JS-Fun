// var cvs = new HTMLCanvasElement();
// var ctx = cvs.getContext("2d");

var defaultOpts = {
    lineWidth : 1,
    lineCap : "round",
    lineJoin : "round",
    strokeStyle : "red",    //#ff0000
    fillStyle : "blue"
}

function Grid(x1, y1, x2, y2, m, n){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.m = m;
    this.n = n;
    
    this.w = x2 - x1;
    this.h = y2 - y1;

    this.wStep = this.w / m;
    this.hStep = this.h / n;

    this.locatePoint = function(x, y) {
        var result = { row : undefined };
        for(var i= x1; i < this.m; i++) 
            if(x >= (x1 + i * this.wStep) && x <= (x1 + (i + 1) * this.wStep))
                result.col = i;
        for(var j= y1; j < this.n; j++)
            if(y >= (y1 + j * this.hStep) && y <= (y1 + (j + 1) * this.hStep))
                result.row = j;

        // console.log("results: ", result);

        return result;
    }

    this.highlightRect = function(col, row, color, stroke, noStroke) {
        color = color || draw.getRandomColorString();
        stroke = stroke || this.defaultOpts? this.defaultOpts.strokeStyle : "black";
        var x1 = this.x1 + this.wStep * col;
        var y1 = this.y1 + this.hStep * row;
        var Opts = { fillStyle : color, strokeStyle: stroke}
        drawRect(x1, y1, this.wStep, this.hStep, Opts, noStroke);
    }

    // this.
}

// Linear
function drawLine(x1, y1, x2, y2, Opts) {
    var ctx = this.ctx;

    if(typeof(x1) == "object"){
        y2 = x1.y2;
        x2 = x1.x2;
        y1 = x1.y1;
        x1 = x1.x1;
    }
    
    getOpts(ctx ,Opts);
    
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    LOG(`line drawn.. P1: { x: ${x1}, y: ${y1}} \tP2 { x: ${x2}, y: ${y2} }`);

    return this;
}
function drawGrid(m,n,x,y,w,h,Opts){
    
    getOpts(ctx ,Opts);

    // extra checking // w = this.width  && w > this.width   ? this.width    : w || this.width;  
    // extra checking // h = this.height && h > this.height  ? this.height   : h || this.height; 
    w = w || this.width;
    h = h || this.height;
    x = x || 0;
    y = y || 0;

    var wStep = w / m;
    var hStep = h / n;
    
    var X2 = x + w;
    var Y2 = y + h;
    //draw columns
    for(var i = x; i <= X2; i += wStep)
        drawLine(i,y,i,Y2,Opts);

    //draw Rows
    for(var j = y; j <= Y2; j += hStep)
        drawLine(x,j, X2 ,j,Opts);

    return new Grid(x, y, X2, Y2, m, n);
}
// Circular
function drawCircle(x, y, r, Opts) {
    this.ctx.moveTo(x,y);
    
    getOpts(ctx ,Opts);

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.closePath();

    //if(Opts)
        //LOG(Opts.fillStyle)
        //LOG(this.ctx.fillStyle)
    this.ctx.fill();
    //LOG(`circle drawn.. x:${x} y:${y} r:${r}`);
    return this;
}
// Rectangular
function drawRect(x,y,w,h, Opts, noStroke) {
    getOpts(ctx ,Opts);
    ctx.fillRect(x,y,w,h);
    if (!noStroke) ctx.strokeRect(x,y,w,h);
}
function drawSquare(x, y, l, Opts) {
    getOpts(ctx ,Opts);
    ctx.fillRect(x, y, l, l);
}


function DrawJS(cvs, width, height) {
    if(!cvs || ! cvs instanceof HTMLCanvasElement) return LOG('canvas not found or invalid!');

    this.width = cvs.width  = width  || cvs.width;
    this.height = cvs.height = height || cvs.height;
    var ctx = cvs.getContext("2d");

    this.canvas  = this.cvs = cvs;
    this.context = this.ctx = ctx;
    this.defaultOpts = defaultOpts;

    this.drawLine = drawLine;
    this.drawCircle = drawCircle;
    this.drawRect = drawRect;
    this.drawSquare = drawSquare;
    this.drawGrid = drawGrid;

    this.clearCanvas = clearCanvas;

    this.getRandomColorString = getRandomColorString;
    this.getColorString = getColorString;
}

//// COLORS ////
function getRandomColorString(){
    var R = 255 * Math.random();
    var G = 255 * Math.random();
    var B = 255 * Math.random();

    R = Math.floor(R);
    G = Math.floor(G);
    B = Math.floor(B);

    return getColorString(R, G, B);
}
function getColorString(R, G, B) {
    // var r = R < 255 ? R : Math.random() * 255;
    // var g = G < 255 ? G : Math.random() * 255;
    // var b = B < 255 ? B : Math.random() * 255;
    // return `#${r}${g}${b}`;
    
    // return `#${R.toString(16)}${G.toString(16)}${B.toString(16)}`;
    R = Math.floor(R).toString(16);
    G = Math.floor(G).toString(16);
    B = Math.floor(B).toString(16);

    if(R.length < 2) R = "0"+R;
    if(G.length < 2) G = "0"+G;
    if(B.length < 2) B = "0"+B;

    return `#${R}${G}${B}`;
}

// canvas utilities
function getOpts(ctx, Opts) {
    if(!Opts) Opts={};
    if(!ctx)  return LOG('No CTX');
    // for (prop in defaultOpts)
    //     ctx[prop] = Opts[prop] || defaultOpts[prop];
    ctx.fillStyle = Opts.fillStyle;
    ctx.strokeStyle = Opts.strokeStyle;
}
function clearCanvas(){
    this.ctx.clearRect(0,0,this.width,this.height);
    LOG('canvas Cleared');
    return this;
}

function LOG() {
    console.log.apply(this, arguments);
}