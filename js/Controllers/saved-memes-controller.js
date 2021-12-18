'use strict'

function initSavedMemes() {
    hideGallery();
    hideEditor();
    showSavedMemes();
    renderSavedMemes();
}

function showSavedMemes() {
    document.querySelector('.saved-memes-container').classList.remove('display-none');
}

function hideSavedMemes() {
    document.querySelector('.saved-memes-container').classList.add('display-none');
}

function renderSavedMemes() {
    const memes = getSavedMemes();

    const strHTMLs = memes.map((meme) => `<img src="${meme.src}" id="${meme.id}" onclick="onImgSelect(this)" class="meme-img" alt="Saved Meme">`);
    
    const msg = 
    `<p style="text-align: center">Sorry, no saved memes yet...<br>Try creating a meme through the gallery & meme editor 
    <button class="btn-more-keywords back-to-gallery" href="" onclick="refreshPage()">Back to Gallery</button>`;

    document.querySelector('.saved-memes-gallery').innerHTML = (memes.length)? strHTMLs.join('') : msg;
}