var cvs = document.getElementById('myCanvas');
var ctx = cvs.getContext('2d');
// var draw = new DrawJS(cvs,1200,700);
var draw = new DrawJS(cvs,700,500);

// var x = { x1: 0, y1: 0, x2: 200, y2 : 100 }
// draw.drawLine(x)
//     .drawLine(200,200,100,100)
//     .drawLine(50,50,100,200)
//     .drawCircle(50,50,10)
//     .drawCircle(60,100,10);

// setInterval(() => drawPoint(), 50);
var Arr = [];
for(let i=0; i<cvs.width; i++) {
    Arr[i] = [];
    for(let j=0; j<cvs.height; j++)
        Arr[i][j] = new Point(i,j);
}
function loopCanvas(cvs, f) {
    for(let i=0; i < cvs.width; i+=7)
        for(let j=0; j < cvs.height; j+=7)
            f(Arr[i][j])
}
var k = 300;

var _r = generatePoint(250,300);
var _g = generatePoint(500,500);
var _b = generatePoint(1,1);
var __r = [];
var __g = [];
var __b = [];

function genR() { var p = generatePoint(); __r.push(p); points.push(p); p.Vx=Math.random()*15; p.Vy=Math.random()*15; };
function genG() { var p = generatePoint(); __g.push(p); points.push(p); p.Vx=Math.random()*15; p.Vy=Math.random()*15; };
function genB() { var p = generatePoint(); __b.push(p); points.push(p); p.Vx=Math.random()*15; p.Vy=Math.random()*15; };

var points = [];
points.push(_r);    __r.push(_r);
points.push(_g);    __g.push(_g);    
points.push(_b);    __b.push(_b);
_r.Vx = 15; _r.Vy = -12;
_g.Vx = -15; _g.Vy = -16;
_b.Vx = 8; _b.Vy = 10;

setInterval(function(){
    // console.time('loop');
    loopCanvas(cvs,function(p){
        var r = getDistances(__r, p);
        var g = getDistances(__g, p);
        var b = getDistances(__b, p);

        // var r = getDistance(p, _r);
        // var g = getDistance(p, _g);
        // var b = getDistance(p, _b);

        // var master = Math.max(__r.length, __g.length, __b.length);
        var master = r+b+g;//.length + __g.length +  __b.length;
        r /= master;
        g /= master;
        b /= master;


        r = normalize(r);
        g = normalize(g);
        b = normalize(b);
    
        if(k-->0){ 
            console.log(r,g,b);
        }
        var c = getColorString(r, g, b);
        // LOG(c);
        drawPointRect(p, 0 , c)
    });
    // console.timeEnd('loop');
    
    for(let i = 0; i < __r.length; i++) drawPoint(__r[i], 0, '#FF0000');
    for(let i = 0; i < __g.length; i++) drawPoint(__g[i], 0, '#00FF00');
    for(let i = 0; i < __b.length; i++) drawPoint(__b[i], 0, '#0000FF');
    // drawPoint(_r,0,'#FF0000');
    // drawPoint(_g,0,'#00FF00');
    // drawPoint(_b,0,'#0000FF');

    movePoints();
}, 10);
// setInterval(function(){
//     // console.time('loop');
//     loopCanvas(cvs,function(p){
//         var r = getDistance(p, _r);
//         var g = getDistance(p, _g);
//         var b = getDistance(p, _b);
    
//         r = normalize(r);
//         g = normalize(g);
//         b = normalize(b);
    
//         if(k-->0)console.log(b);
//         var c = getColorString(r, g, b);
//         // LOG(c);
//         drawPointRect(p, 0 , c)
//     });
//     // console.timeEnd('loop');
    
//     drawPoint(_r,0,'#FF0000');
//     drawPoint(_g,0,'#00FF00');
//     drawPoint(_b,0,'#0000FF');

//     movePoints();
// }, 10);

LOG("_r",_r,"_g",_g,"_b",_b)
// setInterval(movePoints,500);

function movePoints() {
    for(let i=0; i < points.length; i++) {
        points[i].x += points[i].Vx;
        points[i].y += points[i].Vy;

        if(points[i].x > cvs.width || points[i].x < 0) points[i].Vx = -points[i].Vx;
        if(points[i].y > cvs.height || points[i].y < 0 ) points[i].Vy = -points[i].Vy;
    }
}


function normalize(d) {
    // d = d * 255 / (2 * cvs.width);
    d = d * 255;
    d = 255 - d;
    d = Math.min(d,255);
    return d;    
}
function ayman(d) {
    // d = sigmoid(d);
    // d *= 255;
    // d = 255-d;
}
function sigmoid (k){
    return Math.cos(k) ;//- k * Math.exp(.1/k);
}


function getDistances(p, p2){
    var d = 0;
    // console.log(p.length)
    for(let i = 0; i < p.length; i++)
        d+= getDistance(p[i], p2);
    return d;
}
function getDistance(p1, p2) {
    if(!(p1 instanceof Point) && !(p2 instanceof Point)) return;
    var distX = p1.x - p2.x;
    var distY = p1.y - p2.y;

    var pow2 = Math.pow(distX, 2) + Math.pow(distY, 2);
    var dist = Math.sqrt(pow2);

    // LOG('distX: ',distX,' distY: ', distY, " pow2: ", pow2, " dist: ", dist);
    return dist;
}
function Point(x, y) { 
    this.x = x;// || Math.random() * 100;
    this.y = y;// || Math.random() * 100;
}
function generatePoint(x, y) {
    this.x = x || Math.random() * cvs.width;
    this.y = y || Math.random() * cvs.height;

    return new Point(this.x, this.y);
}
function drawPoint(x,y,c) {
    c = c || draw.getRandomColorString();

    if(!(x instanceof Point)) {
        var p = generatePoint(x, y);
        return draw.drawCircle(p.x, p.y, 5, { fillStyle: c, strokeStyle : c  });
    }

    return draw.drawCircle(x.x,x.y,5, { fillStyle: c, strokeStyle : c });
}
function drawPointRect(x, y, c) {
    c = c || draw.getRandomColorString();
    if(!(x instanceof Point)) {
        var p = generatePoint(x, y);
        return draw.drawSquare(p.x, p.y, 7, { fillStyle: c, strokeStyle : c  });
    }
    
    return draw.drawSquare(x.x,x.y, 7, { fillStyle: c, strokeStyle : c });
}