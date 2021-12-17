'use strict'

let gMeme = null;

function setLineBoundaries(xStart, yStart, xEnd, yEnd, idx) {
    gMeme.lines[idx].boundaries = { xStart, xEnd: xStart + xEnd, yStart, yEnd: yStart + yEnd };
}

function setAlignText(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;
    switch (direction) {
        case 'start':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = 20;
            break;
        case 'end':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = 480;
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = 250;
            break;
    }


}

function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily;
}

function setFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fill = color;
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = color;
}

function setFontSize(change) {
    switch (change) {
        case 1:
            gMeme.lines[gMeme.selectedLineIdx].size++;
            break;
        case -1:
            gMeme.lines[gMeme.selectedLineIdx].size--;
            break;
    }
    console.log('gMeme.lines[gMeme.selectedLineIdx].size :', gMeme.lines[gMeme.selectedLineIdx].size);
}

function removeLine() {
    if (gMeme.lines.length === 0) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = 0;
}

function addLine() {
    gMeme.lines.push({
        txt: 'Enter your text here',
        font: 'impact',
        size: 40,
        align: 'center',
        fill: 'white',
        stroke: 'black',
        pos: { x: 250, y: 250 }
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function switchLine(idx) {
    gMeme.shouldMarkText = true;
    if (idx >= 0) {
        gMeme.selectedLineIdx = idx;
    } else {
        gMeme.selectedLineIdx = (gMeme.selectedLineIdx === gMeme.lines.length - 1) ? 0 : gMeme.selectedLineIdx + 1;
    }
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function getMeme() {
    return gMeme;
}

function createMeme(selectedImgId) {
    gMeme = {
        selectedImgId,
        selectedLineIdx: 0,
        shouldMarkText: true,
        lines: [
            {
                txt: 'Enter your text here',
                font: 'impact',
                size: 40,
                align: 'center',
                fill: 'white',
                stroke: 'black',
                pos: { x: 250, y: 50 }
            },
            {
                txt: 'Enter your text here',
                font: 'impact',
                size: 40,
                align: 'center',
                fill: 'white',
                stroke: 'black',
                pos: { x: 250, y: 450 }
            }
        ]
    }
}