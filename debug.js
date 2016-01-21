'use strict';

const YowJS = require('./src/yowjs.js');

let yowjs = new YowJS(),
    countryCode = 1,
    phoneNumber = 123,
    password = '';


yowjs.initialize(
    countryCode,
    phoneNumber,
    password
)
.on('CHAT_RECEIVE', (message) => {
    console.log(message);
}).on('LINK_DEAD', () => {
    console.log('YOWSUP_LINK_DEAD');
})
.connect();