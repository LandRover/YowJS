'use strict';

const BasePayload = require('./base_payload');

class MessagePrivate extends BasePayload {

    constructor() {}
    
    
    getPattern() {
        return /^\[(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/; // [0000000000000@s.whatsapp.net(01-01-2016 01:01)]:[ABCDEF1234567890000]    Hi
    }
}

module.exports = MessagePrivate;