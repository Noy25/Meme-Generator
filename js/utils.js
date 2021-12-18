'use strict'

// Returns a random id of letters/digits.
function getRandomId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';

    for (let i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return id;
}

function getRandomKeywords(count = 2, gKeywords) {
    let keywords = [];

    for (let i = 0; i < count; i++) {
        keywords[i] = gKeywords[getRandomInt(0, gKeywords.length)];
    }

    return keywords
}

// Returns a random integer between the min - max range (maximum is exclusive).
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}