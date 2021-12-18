'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

let gElCanvas;
let gCtx;
let gStartPos;

const gStickers = ['❤', '😁', '😂', '🤣', '😅', '😎', '😋', '😍', '😘', '🥰', '😑', '🤩', '🙄', '😏', '😣', '😥', '😪', '🥱'];
const gStickersToShow = 4;
let gStickerIdx = 0;


function onImgSelect(elImg) {
    hideGallery();
    hideSavedMemes();
    showEditor();
    initCanvas();
    createMeme(elImg.id);
    renderStickers();
    renderMeme();
}

function showEditor() {
    document.querySelector('.meme-editor-container').classList.remove('display-none');
    document.querySelector('.meme-editor-container').classList.add('flex');
}

function hideEditor() {
    document.querySelector('.meme-editor-container').classList.add('display-none');
    document.querySelector('.meme-editor-container').classList.remove('flex');
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas');
    resizeCanvas();
    gCtx = gElCanvas.getContext('2d');
    addListeners();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = gElCanvas.width;
    // gElCanvas.height = elContainer.offsetHeight;
    setCanvasMetrics();
}

function renderMeme() {
    const meme = getMeme();
    const { selectedImgId, lines } = meme;

    const elImg = document.getElementById(`${selectedImgId}`);
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);

    updateTextInput();

    drawText(lines, meme);
}

function renderStickers() {
    let strHTMLs = [`<button class="btn-sticker-prev" onclick="onScrollStickers(-1)"><</button>`];

    const stickers = getStickersForDisplay();

    for (let i = 0; i < 4; i++) {
        const className = (stickers[i] === '❤') ? 'sticker heart' : 'sticker';
        strHTMLs.push(`<span class="${className}" onclick="onAddSticker(this.innerText)">${stickers[i]}</span>`);
    }

    strHTMLs.push(`<button class="btn-sticker-next" onclick="onScrollStickers(1)">></button>`);

    document.querySelector('.control-stickers').innerHTML = strHTMLs.join('');
}

function getStickersForDisplay() {
    if (gStickerIdx + 3 < gStickers.length) {
        return gStickers.slice(gStickerIdx, gStickerIdx + 4);
    } else {
        const gap = gStickers.length - gStickerIdx;
        return gStickers.slice(gStickerIdx, gStickerIdx + gap).concat(gStickers.slice(0, 4 - gap));
    }
}

function onScrollStickers(diff) {
    gStickerIdx += diff;
    if (gStickerIdx === -1) {
        gStickerIdx = gStickers.length - 1;
    }
    if (gStickerIdx === gStickers.length) gStickerIdx = 0;
    renderStickers();
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

        const metrics = getLineRectMetrics(idx);
        setLineBoundaries(metrics, idx);

        if (idx === meme.selectedLineIdx && meme.isLineSelected) {
            markSelectedLine(metrics);
        };
    });

}

function markSelectedLine(metrics) {
    const { xStart, yStart, xEnd, yEnd } = metrics;
    gCtx.beginPath();
    gCtx.rect(xStart, yStart, xEnd, yEnd);
    gCtx.lineWidth = 3;
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.closePath();
}

function onAddSticker(emoji) {
    addSticker(emoji);
    renderMeme();
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

    window.addEventListener('resize', () => {
        resizeCanvas();
        renderMeme();
    });
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
            // offsetX: ev.clientX,
            // offsetY: ev.clientY - ev.target.offsetTop
            offsetX: ev.pageX - rect.left,
            offsetY: ev.pageY - rect.top
        }
    }
    return pos
}