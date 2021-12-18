'use strict'

let gMeme = null;
let gCanvasWidth;
let gCanvasHeight;

function downloadCanvas(elLink) {
    // Clean rectangles on canvas
    gMeme.isLineSelected = false;
    renderMeme();

    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function shareToFacebook(elLink) {
    // Clean rectangles on canvas
    gMeme.isLineSelected = false;
    renderMeme();

    const imgDataUrl = gElCanvas.toDataURL();
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        elLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank">`;

        // window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`);
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function setAlignText(direction) {
    if (!gMeme.isLineSelected) return;
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
    if (!gMeme.isLineSelected) return;
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily;
}

function setFillColor(color) {
    if (!gMeme.isLineSelected) return;
    gMeme.lines[gMeme.selectedLineIdx].fill = color;
}

function setStrokeColor(color) {
    if (!gMeme.isLineSelected) return;
    gMeme.lines[gMeme.selectedLineIdx].stroke = color;
}

function setFontSize(change) {
    if (!gMeme.isLineSelected) return;
    switch (change) {
        case 1:
            gMeme.lines[gMeme.selectedLineIdx].size++;
            break;
        case -1:
            gMeme.lines[gMeme.selectedLineIdx].size--;
            break;
    }
}

function removeLine() {
    if (gMeme.lines.length === 0 || !gMeme.isLineSelected) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = 0;
}

function addLine() {
    gMeme.isLineSelected = true;
    gMeme.lines.push({
        txt: 'Enter your text here',
        font: 'impact',
        size: 40,
        align: 'center',
        fill: 'white',
        stroke: 'black',
        pos: { x: gCanvasWidth / 2, y: gCanvasHeight / 2 },
        isDrag: false
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function switchLine(idx) {
    gMeme.isLineSelected = true;
    if (idx >= 0) {
        gMeme.selectedLineIdx = idx;
    } else {
        gMeme.selectedLineIdx = (gMeme.selectedLineIdx === gMeme.lines.length - 1) ? 0 : gMeme.selectedLineIdx + 1;
    }
}

function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx;
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy;
}

function isLineClicked(pos) {
    return gMeme.lines.findIndex(line => {
        const { xStart, xEnd, yStart, yEnd } = line.boundaries;
        return ((pos.offsetX >= xStart && pos.offsetX <= xEnd) && (pos.offsetY >= yStart && pos.offsetY <= yEnd));
    });
}

function toggleLineIsDrag(shouldDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = shouldDrag;
}

function setIsLineSelected(shouldSelect) {
    gMeme.isLineSelected = shouldSelect;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getMeme() {
    return gMeme;
}

function setLineBoundaries(metrics, idx) {
    const { xStart, yStart, xEnd, yEnd } = metrics;
    gMeme.lines[idx].boundaries = { xStart, xEnd: xStart + xEnd, yStart, yEnd: yStart + yEnd };
}

function getLineRectMetrics(idx) {
    const line = gMeme.lines[idx];
    let height = line.size;
    let width = gCtx.measureText(line.txt).width;;
    let yStart = line.pos.y - height;
    let xEnd = width + 10;
    let yEnd = height + 10;
    let xStart;

    if (line.align === 'center') xStart = line.pos.x - (width / 2) - 5;
    else if (line.align === 'start') xStart = line.pos.x - 5;
    else xStart = line.pos.x - width - 5;

    return { xStart, yStart, xEnd, yEnd };
}

function setCanvasMetrics() {
    gCanvasWidth = gElCanvas.width;
    gCanvasHeight = gElCanvas.height;
    // if (gMeme) {
    //     gMeme.lines.forEach(line => {
    //         line.pos.x = gCanvasWidth / 2;
    //         line.pos.y = gCanvasHeight / 2;
    //     });
    //     renderMeme();
    // }
}

function createMeme(selectedImgId) {
    gMeme = {
        selectedImgId,
        selectedLineIdx: 0,
        isLineSelected: true,
        lines: [
            {
                txt: 'Enter your text here',
                font: 'impact',
                size: 40,
                align: 'center',
                fill: 'white',
                stroke: 'black',
                pos: { x: gCanvasWidth / 2, y: gCanvasHeight * 0.15 },
                isDrag: false
            },
            {
                txt: 'Enter your text here',
                font: 'impact',
                size: 40,
                align: 'center',
                fill: 'white',
                stroke: 'black',
                pos: { x: gCanvasWidth / 2, y: gCanvasHeight * 0.9 },
                isDrag: false
            }
        ]
    }
}