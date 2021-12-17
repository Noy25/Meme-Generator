'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

let gElCanvas;
let gCtx;
let gStartPos;


function onInitEditor(elImg) {
    hideGallery();
    showEditor();
    initCanvas();
    createMeme(+elImg.id);
    renderMeme();
}

function showEditor() {
    document.querySelector('.meme-editor-container').classList.remove('display-none');
    document.querySelector('.meme-editor-container').classList.add('flex');
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas');
    gElCanvas.width = 500;
    gElCanvas.height = 500;
    gCtx = gElCanvas.getContext('2d');
    addListeners();
}

function renderMeme() {
    const meme = getMeme();
    const { selectedImgId, lines } = meme;

    const elImg = document.getElementById(`${selectedImgId}`)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);

    updateTextInput();

    drawText(lines, meme);
}

function updateTextInput() {
    const meme = getMeme();
    const txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : 'Press the "+" button to add a new line';
    document.querySelector('input[class="text-line-input"]').value = txt;
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

        if (idx === meme.selectedLineIdx && meme.isLineSelected) {
            markSelectedLine(xStart, yStart, xEnd, yEnd);
        };
    });

}

function markSelectedLine(xStart, yStart, xEnd, yEnd) {
    gCtx.beginPath();
    gCtx.rect(xStart, yStart, xEnd, yEnd);
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'black';
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

////////// MOUSE & TOUCH EVENTS //////////

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
    const pos = getEvPos(ev);
    const lineIdx = isLineClicked(pos);
    if (lineIdx < 0) {
        setIsLineSelected(false);
        renderMeme();
        return;
    };
    onSwitchLine(lineIdx);
    toggleLineIsDrag(true);
    gStartPos = pos;
    gElCanvas.style.cursor = 'grabbing';
}

function onMove(ev) {
    const line = getLine();
    if (!line.isDrag) return;
    const pos = getEvPos(ev);
    const dx = pos.offsetX - gStartPos.offsetX;
    const dy = pos.offsetY - gStartPos.offsetY;
    moveLine(dx, dy);
    gStartPos = pos;
    renderMeme();
    gElCanvas.style.cursor = 'grabbing';
}

function onUp() {
    toggleLineIsDrag(false);
    gElCanvas.style.cursor = 'grab'
}

function getEvPos(ev) {
    let pos = {
      offsetX: ev.offsetX,
      offsetY: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
      ev.preventDefault()
      ev = ev.changedTouches[0]
      let rect = ev.target.getBoundingClientRect();
      pos = {
        offsetX: ev.pageX - rect.left,
        offsetY: ev.pageY - rect.top
      }
    }
    return pos
  }