'use strict'

function onInitGallery() {
    renderImages();
    renderKeywords();
}

function renderKeywords() {
    const keywords = getKeywords();
    const strHTMLs = keywords.map(keyword => `<a class="keyword" id="${keyword}" onclick="renderImages(this.id)">${keyword}</a>`);
    document.querySelector('.keywords-container').innerHTML = strHTMLs.join('');
}

function renderImages(keyword) {
    const imgs = getImgsForDisplay(keyword);
    const strHTMLs = imgs.map((img, idx) => `<img src="${img.url}" onclick="onInitEditor(this)" class="meme-img" id="${img.id}" alt="Image ${idx + 1}">`)
    const msg = `<p style="text-align: center">Sorry, no matches.<br>Try searching for something else or trying using one of the keywords above.`
    document.querySelector('.gallery').innerHTML = (imgs.length)? strHTMLs.join('') : msg;
}