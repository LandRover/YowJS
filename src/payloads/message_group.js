'use strict';

const BasePayload = require('./base_payload'),
      MessageModel = require('../message/message_model');

class MessageGroup extends BasePayload {
    /**
     *
     */
    getPattern() {
        return /^\[(\d+)\/(\d+)-(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/; // [0000000000000/0000000000000-1234567890@g.us(01-01-2016 01:01)]:[ABCDEF1234567890000]	 Hi
    }


    /**
     *
     */
    initializeModel(modelData) {
        return new MessageModel(modelData);
    }
}

module.exports = MessageGroup;