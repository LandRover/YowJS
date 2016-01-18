'use strict';

const PayloadBase = require('./payload_base'),
      MessageModel = require('../message/message_model');

class MessagePrivate extends PayloadBase {
    /**
     *
     */
    getPattern() {
        return /^\[(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/; // [0000000000000@s.whatsapp.net(01-01-2016 01:01)]:[ABCDEF1234567890000]	 Hi
    }


    /**
     *
     */
    initializeModel(model) {
        return new MessageModel(model);
    }
}

module.exports = MessagePrivate;