'use strict'

let gElCanvas;
let gCtx;


function onInitEditor(elImg) {
    document.querySelector('.gallery-container').classList.add('display-none');
    document.querySelector('.meme-editor-container').classList.remove('display-none');
    document.querySelector('.meme-editor-container').classList.add('flex');
    initCanvas();
    createMeme(+elImg.id);
    renderMeme();
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas');
    resizeCanvas();
    gCtx = gElCanvas.getContext('2d');
}

function renderMeme() {
    const meme = getMeme();
    const { selectedImgId, lines } = meme;

    const elImg = document.getElementById(`${selectedImgId}`)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);

    updateTextInput();

    drawText(lines, meme);
}

function drawText(lines, meme) {

    lines.forEach(line => {
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.fill;
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.lineWidth = 1;
        gCtx.strokeStyle = line.stroke;
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
    })

    markSelectedLine(meme.lines[meme.selectedLineIdx]);
}

function markSelectedLine(line) {
    let height = line.size;
    let width;
    let xStart;
    let yStart;
    let xEnd;
    let yEnd;

    if (line.align === 'center') {
        width = gCtx.measureText(line.txt).width;
        // console.log(width)
        xStart = line.pos.x - (width / 2) - 5;
        yStart = line.pos.y + 10;
        xEnd = width + 10;
        yEnd = -height - 10;
        // console.log('xStart', xStart, 'yStart', yStart, 'xEnd', xEnd, 'yEnd', yEnd);
    }

    gCtx.beginPath();
    gCtx.rect(xStart, yStart, xEnd, yEnd);
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
    gCtx.closePath();
}

function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily);
    renderMeme();
}

function onSetFillColor(color) {
    setFillColor(color);
    renderMeme();
}

function onSetStrokeColor(color) {
    setStrokeColor(color);
    renderMeme();
}

function onSetFontSmaller() {
    setFontSmaller();
    renderMeme();
}

function onSetFontBigger() {
    setFontBigger();
    renderMeme();
}

function onRemoveLine() {
    removeLine();
    renderMeme();
}

function onAddLine() {
    addLine();
    renderMeme();
}

function onSwitchLine() {
    switchLine();
    updateTextInput();
    const meme = getMeme();
    
}

function onSetLineTxt(txt) {
    setLineTxt(txt);
    renderMeme();
}

function updateTextInput() {
    const meme = getMeme();
    const txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : 'Press the "add" button to add a new line';
    document.querySelector('input[class="text-line-input"]').value = txt;
}

// TO BE DELETED LATER
function resizeCanvas() {
    gElCanvas.width = 500;
    gElCanvas.height = 500;
}

// CHANGE LATER :
//   function resizeCanvas() {
//     const elCanvasContainer = document.querySelector('.canvas-container');
//     gElCanvas.width = elCanvasContainer.offsetWidth;
//     gElCanvas.height = elCanvasContainer.offsetHeight;
// }