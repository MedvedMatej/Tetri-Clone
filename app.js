const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let scale = 30;

canvas.width = canvas.width * scale + 8;
canvas.height = canvas.height * scale +8;

const np_canvas = document.getElementById("nextPiece_canvas");
const np_ctx = np_canvas.getContext("2d");
const hp_canvas = document.getElementById("heldPiece_canvas");
const hp_ctx = hp_canvas.getContext("2d");

function initArea(){
    area = [];
    for(let i = 0; i < 20; i++){
        area.push([-1,0,0,0,0,0,0,0,0,0,0,-1]);
    }
    area.push([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);

    px=3;
    py=0;
    activePiece = blocks[Math.floor(Math.random()*(blocks.length))];

    nextPiece = blocks[Math.floor(Math.random()*(blocks.length))];
    drawSecondaryPiece(null,"next")

    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;

    heldPiece = null;
    drawSecondaryPiece(heldPiece,"held")
}

function clearArea(){
    for(let i = 0; i < area.length-1; i++){
        for(let j = 1; j < area[i].length-1; j++){

            ctx.fillStyle = "#ffffff";
            ctx.fillRect((j-1)*scale+4, i*scale+4, scale, scale);
            ctx.strokeStyle = "#e3e3e3";
            ctx.lineWidth = 2;
            ctx.strokeRect((j-1)*scale+4, i*scale+4, scale, scale);
            
        }
    }
    ctx.strokeStyle = "#e3e3e3";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawArea(){
    for(let i = 0; i < area.length-1; i++){
        for(let j = 1; j < area[i].length-1; j++){
            if(area[i][j]){
                //Set color
                ctx.fillStyle = colors[area[i][j]][1];
                ctx.fillRect((j-1)*scale+4,i*scale+4,scale,scale);

                //Set secondary color
                ctx.fillStyle = colors[area[i][j]][0];
                ctx.fillRect((j-1)*scale+2+4,i*scale+2+4,scale-4,scale-4)
            }

        }
    }
}

function drawActivePiece(piece, x, y){
    for(let i = 0; i < piece.length; i++){
        for(let j = 0; j < piece[i].length; j++){
            if(piece[i][j]){
                ctx.fillStyle = colors[piece[i][j]][1];
                ctx.fillRect((j+x-1)*scale+4,(i+y)*scale+4,scale,scale);
                ctx.fillStyle = colors[piece[i][j]][0];
                ctx.fillRect((j+x-1)*scale+2+4,(i+y)*scale+2+4,scale-4,scale-4)
            } 
        }
    }
}

function drawSecondaryPiece(piece,type){
    let tmp_ctx = null;
    if(type == "next"){
        tmp_ctx = np_ctx;
    }
    else{
        tmp_ctx = hp_ctx;
    }
    tmp_ctx.fillStyle= "#f3f3f3";
    tmp_ctx.fillRect(0,0,np_canvas.width,np_canvas.height);
    let offsetx = 0.85
    let offsety = 1.5
    if(!piece) return 0;
    if(piece.length == 2){
        console.log("Here")
        offsetx = 1.35
        offsety = 1.35
    }
    if(piece.length == 4){
        offsety = 0.35
    }

    for(let i = 0; i < piece.length; i++){
        for(let j = 0; j < piece[i].length; j++){
            if(piece[i][j]){
                tmp_ctx.fillStyle = colors[piece[i][j]][1];
                tmp_ctx.fillRect((j+offsetx)*scale+4,(i+offsety)*scale+4,scale,scale);
                tmp_ctx.fillStyle = colors[piece[i][j]][0];
                tmp_ctx.fillRect((j+offsetx)*scale+2+4,(i+offsety)*scale+2+4,scale-4,scale-4)
            } 
        }
    }
}

function mergePiece(activePiece, x, y){
    if(y < 0) {
        gameOver();
        return 1
    }
    for(let i = 0; i < activePiece.length; i++){
        for(let j = 0; j < activePiece[i].length; j++){
            area[y+i][x+j] = area[y+i][x+j] || activePiece[i][j]; 
        }
    }
    return 0;
}

function collision(activePiece, x, y, area){
    for(let i = 0; i < activePiece.length; i++){
        for(let j = 0; j < activePiece[i].length; j++){
            if(activePiece[i][j] && area[y+i][x+j])
                return 1;
        }
    }
    return 0;
}

function gameOver(){
    initArea();
    clearArea();
}

function rotatePiece(activePiece){
    var n=activePiece.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=activePiece[i][j];
            activePiece[i][j]=activePiece[n-j-1][i];
            activePiece[n-j-1][i]=activePiece[n-i-1][n-j-1];
            activePiece[n-i-1][n-j-1]=activePiece[j][n-i-1];
            activePiece[j][n-i-1]=tmp;
        }
    }
}

function checkLines(){
    for(let i = 0; i < area.length-1; i++){
        let full = 1;
        for(let j = 1; j< area[0].length-1;j++){
            if(area[i][j] == 0) full = 0;
        }
        if(full) clearLines(i);
    }
}

function clearLines(i){
    for(;i > 0 ;i--){
        area[i] = area[i-1];
    }
    area[0] = [-1,0,0,0,0,0,0,0,0,0,0,-1];
    score++;
    document.getElementById("score").innerHTML = "Score: " + score;
}

blocks = [
    [
        [1,1],
        [1,1]
    ],
    [
        [0,2,0],
        [2,2,2],
        [0,0,0]
    ],
    [
        [0,3,0,0],
        [0,3,0,0],
        [0,3,0,0],
        [0,3,0,0],
    ],
    [
        [0,0,4],
        [4,4,4],
        [0,0,0]
    ],
    [
        [5,0,0],
        [5,5,5],
        [0,0,0]
    ],
    [
        [6,6,0],
        [0,6,6],
        [0,0,0]
    ],
    [
        [0,7,7],
        [7,7,0],
        [0,0,0]
    ]
]

colors = [
    null,
    ["#ffea00", "#ebd700"],
    ["#ff0000","#eb0000"],
    ["#ffa200", "#de8d00"],
    ["#8400ff","#6d00d4"],
    ["#0066ff", "#0055d4"],
    ["#00eaff","#00c9db"],
    ["#62ff00", "#54db00"]
]

document.addEventListener("keydown", event => {

    if (event.keyCode === 80){
        if(!running){
            drawSecondaryPiece(nextPiece,"next");
            window.requestAnimationFrame(gameLoop);
            running = true;
        }
        else{
            running = false;
        }
    }
    if(running){
        if (event.keyCode === 37) {
            px--;
            if(collision(activePiece,px,py,area))
                px++;
        }
        else if (event.keyCode === 39) {
            px++;
            if(collision(activePiece,px,py,area))
                px--;
        }
        else if (event.keyCode === 40) {
            py++;
            if(collision(activePiece,px,py,area))
                py--;
        }
        else if (event.keyCode === 38) {
            //rotate
            rotatePiece(activePiece);
            if(collision(activePiece,px,py,area)){
                for(let i = 0; i < 3; i++){
                    rotatePiece(activePiece)
                }
            }
        }
        else if(event.keyCode === 82){
            initArea()
            clearArea()
            drawSecondaryPiece(nextPiece,"next");
        }
        else if(event.keyCode === 83){
            if(!heldPiece){
                heldPiece = activePiece;
                activePiece = nextPiece;
                nextPiece = blocks[Math.floor(Math.random()*blocks.length)];
                drawSecondaryPiece(nextPiece,"next");
                drawSecondaryPiece(heldPiece,"held");
            }
            else{
                let tmp = heldPiece;
                heldPiece = activePiece;
                activePiece = tmp;
                drawSecondaryPiece(heldPiece,"held");
            }
        }
    }
    


});


let area = [];
let px = null;
let py = null;
let activePiece = null;
let nextPiece = null;
let heldPiece = null;
let running = false;
let speed = 1000;
let previousTimeStamp = 0;
let score = 0;
initArea();
clearArea();




function gameLoop(timeStamp){

    if(timeStamp - previousTimeStamp > speed - Math.sqrt(score)){
        previousTimeStamp = timeStamp;
        py++;
    }

    clearArea()
    if(collision(activePiece,px,py,area)){
        let gameOver = mergePiece(activePiece,px,py-1);
        
        if(!gameOver){
            checkLines();
            activePiece = nextPiece;
            nextPiece = blocks[Math.floor(Math.random()*(blocks.length))];
            drawSecondaryPiece(nextPiece,"next");
            px = 3;
            py = 0;
        }
    }
    
    drawArea();
    drawActivePiece(activePiece,px,py)
    if(running)
        window.requestAnimationFrame(gameLoop);
}