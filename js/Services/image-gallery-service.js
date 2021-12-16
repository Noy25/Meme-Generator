'use strict'

const gKeywords = _createKeywords();
const gKeywordSearchCountMap = _createKeywordSearchCountMap();
const gImgs = _createImgs();


function getImgById(id) {
    return gImgs.find(img => img.id === +id);
}

function getKeywords() {
    return gKeywords;
}

function getImgsForDisplay(keyword) {
        if (!keyword) return gImgs;
        return gImgs.filter(img => {
           const regex = new RegExp('^' + keyword);
           return img.keywords.find(keyword => keyword.match(regex));
        });
        // This crazy RegExp is brought to you by Shahaf Levi.
}

function _createImgs() {
    let imgs = [];

    for (let i = 0; i < 18; i++) {
        let img = {
            id: i + 1,
            url: `imgs/${i + 1}.jpg`,
            keywords: getRandomKeywords(2, gKeywords)
        }
        imgs[i] = img;
    }
    
    return imgs
}

function _createKeywordSearchCountMap() {
    return gKeywords.reduce((acc, keyword) => {
        acc[keyword] = 0;
        return acc;
    }, { });
}

function _createKeywords() {
    return ['happy', 'sad', 'crazy', 'sarcastic', 'funny'];
}