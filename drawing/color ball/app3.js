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
var k = 3;

var _r = generatePoint(250,300);
var _g = generatePoint(500,500);
var _b = generatePoint(1,1);

var points = [];
points.push(_r);
points.push(_g);
points.push(_b);
_r.Vx = 15; _r.Vy = -12;
_g.Vx = -15; _g.Vy = -16;
_b.Vx = 8; _b.Vy = 10;

setInterval( function(){
    // console.time('loop');
    loopCanvas(cvs,function(p){
        var r = getDistance(p, _r);
        var g = getDistance(p, _g);
        var b = getDistance(p, _b);
    
        r = normalize(r);
        g = normalize(g);
        b = normalize(b);
    
        if(k-->0)console.log(b);
        var c = getColorString(r, g, b);
        // LOG(c);
        drawPointRect(p, 0 , c)
    });
    // console.timeEnd('loop');
    
    drawPoint(_r,0,'#FF0000');
    drawPoint(_g,0,'#00FF00');
    drawPoint(_b,0,'#0000FF');

    movePoints();
}, 10);

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
    d = d * 255 / (2 * cvs.width);
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