'use strict';

const BasePayload = require('./base_payload'),
      MessageModel = require('../models/message');

class MessagePrivate extends BasePayload {


    /**
     *
     */
    getPattern() {
        return /^\[(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/; // [0000000000000@s.whatsapp.net(01-01-2016 01:01)]:[ABCDEF1234567890000]	 Hi
    }


    initializeModel(model) {
        return new MessageModel(model);
    }

}

module.exports = MessagePrivate;