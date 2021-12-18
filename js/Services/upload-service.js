'use strict'

function onSaveMeme() {
    // Clean rectangles on canvas
    gMeme.isLineSelected = false;
    renderMeme();

    const dataURL = gElCanvas.toDataURL();
    saveMeme(dataURL);
    initSavedMemes();
}

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