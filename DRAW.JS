let canvas, ctx;
let pens = document.querySelector("#pens");
let pen = document.querySelector("#pen");
let tool = document.querySelector("#tool");
let color = document.querySelector("#color");
let lineBold = document.getElementById('line');
function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
 
    ctx.lineWidth = lineBold.value; // 선 굵기를 2로 설정
    ctx.strokeStyle = "black";
    ctx.lineCap = "round"
 
    // 마우스 리스너 등록. e는 MouseEvent 객체
    canvas.addEventListener("mousemove", function (e) { move(e) }, false);
    canvas.addEventListener("mousedown", function (e) { down(e) }, false);
    canvas.addEventListener("mouseup", function (e) { up(e) }, false);
    canvas.addEventListener("mouseout", function (e) { out(e) }, false);
}

var isCtrl, isAlt;  // ctrl. Alt 눌림 여부 확인


 
const FSaveLine = [];
const CSaveLine = [];
const BSaveLine = [];
const lastPan = [];
let i = 0;
let j = 0;
let startX=0, startY=0; // 드래깅동안, 처음 마우스가 눌러진 좌표
let drawing=false;
let penMode = 1;
let curX = 0;
let curY = 0;

function Pens(){
    penMode = 1;
    console.log('펜');
}
function Pen(){
    penMode = 2;
}
function box(){
    penMode = 3;
}
function tri(){
    penMode = 4;
}
function cir(){
    penMode = 5;
}
function Psdraw() {
    ctx.beginPath();
    ctx.moveTo(FSaveLine[i], FSaveLine[i+1]);
    ctx.lineTo(CSaveLine[i], CSaveLine[i+1]);
    ctx.stroke();
    lastPan[i]=1;
    BSaveLine[i] = lineBold.value;
}
function Pdraw() {
    ctx.beginPath();
    ctx.moveTo(FSaveLine[i], FSaveLine[i+1]);
    ctx.lineTo(CSaveLine[i], CSaveLine[i+1]);
    ctx.stroke();
    i+=2;
    lastPan[i]=2;
    BSaveLine[i] = lineBold.value;
}
function Bdraw() {
    ctx.beginPath();
    ctx.moveTo(FSaveLine[i], FSaveLine[i+1]);
    ctx.lineTo(FSaveLine[i], CSaveLine[i+1]);
    ctx.lineTo(CSaveLine[i], CSaveLine[i+1]);
    ctx.lineTo(CSaveLine[i], FSaveLine[i+1]);
    ctx.lineTo(FSaveLine[i], FSaveLine[i+1]);
    ctx.stroke();
    console.log(FSaveLine[i]);
    i+=2;
    lastPan[i]=3;
    BSaveLine[i] = lineBold.value;
}
function Tdraw() {
    if(CSaveLine[i]>FSaveLine[i]){
        ctx.beginPath();
        ctx.moveTo(Math.abs(FSaveLine[i]-CSaveLine[i])/2+FSaveLine[i], FSaveLine[i+1]);
    }
    else{
        ctx.beginPath();
        ctx.moveTo(FSaveLine[i]-Math.abs(FSaveLine[i]-CSaveLine[i])/2, FSaveLine[i+1]);
    }
    ctx.lineTo(FSaveLine[i], CSaveLine[i+1]);
    ctx.lineTo(CSaveLine[i],CSaveLine[i+1]);
    ctx.closePath();
    ctx.stroke();
    i+=2;
    lastPan[i]=4;
    BSaveLine[i] = lineBold.value;
}
function Cdraw() {
    ctx.beginPath()
    if(CSaveLine[i]>FSaveLine[i] && CSaveLine[i+1]>FSaveLine[i+1])
        ctx.arc(Math.abs(FSaveLine[i]-CSaveLine[i])/2+FSaveLine[i],Math.abs(FSaveLine[i+1]-CSaveLine[i+1])/2+FSaveLine[i+1],Math.abs(FSaveLine[i]-CSaveLine[i+1])/2,0,Math.PI * 2);
    else
        ctx.arc(FSaveLine[i]-Math.abs(FSaveLine[i]-CSaveLine[i])/2,FSaveLine[i+1]-Math.abs(FSaveLine[i+1]-CSaveLine[i+1])/2,Math.abs(FSaveLine[i+1]-CSaveLine[i+1])/2,0,Math.PI * 2);
    ctx.stroke();
    i+=2;
    lastPan[i]=5;
    BSaveLine[i] = lineBold.value;
}

function changeColor(){
    ctx.strokeStyle = color.value;
}

function line(){
    ctx.lineWidth= lineBold.value;
}
/*
function front(){
    i+=2;
    switch(lastPan[i]){
        case 1:
            while(j!=0){
                Psdraw();
                Psdraw();
                Psdraw();
                Psdraw();
                Psdraw();
                j--;
            }
            break;
        case 2:
            Pdraw();
            Pdraw();
            Pdraw();
            Pdraw();
            Pdraw();
            break;
        case 3:
            Bdraw();
            Bdraw();
            Bdraw();
            Bdraw();
            Bdraw();
            break;
        case 4:
            Tdraw();
            Tdraw();
            Tdraw();
            Tdraw();
            Tdraw();
            break;
        case 5:
            Cdraw();
            Cdraw();
            Cdraw();
            Cdraw();
            Cdraw();
            break;
    }
}

function back(){
    i=i-2;
    ctx.lineWidth = BSaveLine[i];
    ctx.strokeStyle="white";
    switch(lastPan[i]){
        case 1:
            while(j!=0){
                Psdraw();
                Psdraw();
                Psdraw();
                Psdraw();
                Psdraw();
                j--;
            }
            break;
        case 2:
            Pdraw();
            Pdraw();
            Pdraw();
            Pdraw();
            Pdraw();
            break;
        case 3:
            Bdraw();
            Bdraw();
            Bdraw();
            Bdraw();
            Bdraw();
            break;
        case 4:
            Tdraw();
            Tdraw();
            Tdraw();
            Tdraw();
            Tdraw();
            break;
        case 5:
            Cdraw();
            Cdraw();
            Cdraw();
            Cdraw();
            Cdraw();
            break;
    }
    ctx.strokeStyle = color.value;
    ctx.lineWidth= lineBold.value;
}
*/
download_img = function(el) {
    // get image URI from canvas object
    var imageURI = canvas.toDataURL("image/jpg");
    el.href = imageURI;
  };

function down(e) {
    startX = e.offsetX*1.5; startY = e.offsetY*1.5;
    FSaveLine[i]=startX; FSaveLine[i+1]=startY;
    drawing = true;
    j=0;
}
function up(e) {
     drawing = false; 
     if(penMode===5){
        Cdraw(curX,curY);
     }
     if(penMode===4){
        Tdraw(curX,curY);
     }
     if(penMode===3){
        Bdraw(curX,curY);
     }
    if(penMode===2){
            Pdraw(curX,curY);
    }
    if(penMode===1){
        i+=2;
    }
    console.log(i);
    console.log(lastPan[i]);
    console.log(BSaveLine[i]);
    }
function move(e) {
    if(!drawing) return; // 마우스가 눌러지지 않았으면 리턴
    j=0;
    curX = e.offsetX*1.5; 
    curY = e.offsetY*1.5;
    CSaveLine[i]=curX;
    CSaveLine[i+1]=curY;
    if(penMode===1){
        Psdraw(curX,curY);
        FSaveLine[i] = CSaveLine[i]; FSaveLine[i+1] = CSaveLine[i+1];
        j++;
    }
    
}
function out(e) { drawing = false; }

/*
ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, curY);
    ctx.lineTo(curX, curY);
    ctx.lineTo(curX, startY);
    ctx.lineTo(startX, startY);
    ctx.stroke(); 
    */