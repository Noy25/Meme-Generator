'use strict'

let gElCanvas;
let gCtx;


function onInitEditor(elImg) {
    // document.querySelector('.gallery-container').classList.add('display-none');
    // document.querySelector('.meme-editor-container').classList.remove('display-none');
    // document.querySelector('.meme-editor-container').classList.add('flex');
    initCanvas();
    createMeme(+elImg.id);
    renderMeme();
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas');
    resizeCanvas();
    gCtx = gElCanvas.getContext('2d');
    gElCanvas.addEventListener('click', (event) => onSelectLineByClick(event));
}

function onSelectLineByClick(ev) {
    const mouseX = ev.offsetX
    const mouseY = ev.offsetY
    const meme = getMeme();
    if (meme.lines.length === 0) return;

    meme.lines.forEach((line, idx) => {
        const { xStart, xEnd, yStart, yEnd } = line.boundaries;
        if (yStart < yEnd) {
            if ((mouseX >= xStart && mouseX <= xEnd) && (mouseY >= yStart && mouseY <= yEnd)) {
                onSwitchLine(idx);
            }
        }
    })
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

    lines.forEach((line, idx) => {
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.fill;
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        gCtx.lineWidth = 1;
        gCtx.strokeStyle = line.stroke;
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);

        ////////// SET BOUNDARIES ON EVERY DRAWN LINE FOR MOUSE/TOUCH EVENTS //////////
        let height = line.size;
        let width = gCtx.measureText(line.txt).width;;
        let yStart = line.pos.y - height;
        let xEnd = width + 10;
        let yEnd = height + 10;
        let xStart;

        if (line.align === 'center') xStart = line.pos.x - (width / 2) - 5;
        else if (line.align === 'start') xStart = line.pos.x - 5;
        else xStart = line.pos.x - width - 5;

        setLineBoundaries(xStart, yStart, xEnd, yEnd, idx);
        ////////// SET BOUNDARIES ON EVERY DRAWN LINE FOR MOUSE/TOUCH EVENTS //////////

        if (idx === meme.selectedLineIdx) {
            markSelectedLine(xStart, yStart, xEnd, yEnd);
        };
    });

}

function markSelectedLine(xStart, yStart, xEnd, yEnd) {
    gCtx.beginPath();
    gCtx.rect(xStart, yStart, xEnd, yEnd);
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
    gCtx.closePath();
}

function onSetAlignText(direction) {
    setAlignText(direction);
    renderMeme();
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

function onSetFontSize(change) {
    setFontSize(change);
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

function onSwitchLine(idx) {
    switchLine(idx);
    updateTextInput();
    renderMeme();
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