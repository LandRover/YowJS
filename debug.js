'use strict';

const YowJS = require('./src/yowjs.js');

let yowjs = new YowJS(),
    countryCode = 972,
    phoneNumber = 542094491,
    password = 'buwQyu2wAp2HQvRaRxstn0OTXiQ=';


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