'use strict';
const BasePayload = require('./payloads/base_payload');

class MessageGroup extends BasePayload {
    
    constructor() {}
    
    
    getPattern() {
        return /^\[(\d+)\/(\d+)-(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/; // [0000000000000/0000000000000-1234567890@g.us(01-01-2016 01:01)]:[ABCDEF1234567890000]     Hi
    }
}

module.exports = MessageGroup;