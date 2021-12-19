'use strict'

function initSavedMemes() {
    hideGallery();
    hideEditor();
    showSavedMemes();
    renderSavedMemes();
}

function onDeleteMeme(memeId) {
    deleteSavedMeme(memeId);
    renderSavedMemes();
}

function showSavedMemes() {
    document.querySelector('.saved-memes-container').classList.remove('display-none');
    document.querySelector('.saved-link').classList.add('focused');
}

function hideSavedMemes() {
    document.querySelector('.saved-memes-container').classList.add('display-none');
    document.querySelector('.saved-link').classList.remove('focused');
}

function renderSavedMemes() {
    const memes = getSavedMemes();

    const strHTMLs = memes.map((meme) => {
        return `<div class="saved-meme">
        <img src="${meme.src}" id="${meme.id}" onclick="onImgSelect(this)" class="meme-img" alt="Saved Meme">
        <button class="btn-delete-meme" onclick="onDeleteMeme('${meme.id}')"><i class="far fa-trash-alt"></i></button>
        </div>`
    });

    const msg =
        `<p style="text-align: center">Sorry, no saved memes yet...<br>Try creating a meme through the gallery & meme editor 
    <button class="btn-more-keywords back-to-gallery" href="" onclick="refreshPage()">Back to Gallery</button>`;

    document.querySelector('.saved-memes-gallery').innerHTML = (memes.length) ? strHTMLs.join('') : msg;
}