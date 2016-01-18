'use strict';

const PayloadBase = require('./payload_base'),
      MessageModel = require('../message/message_model');

class MessageGroup extends PayloadBase {
    /**
     * Regex pattern for matching a group message format.
     * Matching pattern of example: [0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]	 Hi there, group
     *
     * Structure:
     *   0987654321000: sent from
     *   0123456789000-1234567890: sent to group id
     *   g.us: groups identifier
     *   16-01-2016 00:59: date
     *   ABCDEF1234567890000: msgid
     *   Hi there, group: text sent
     */
    getPattern() {
        return /^\[(\d+)\/(\d+)-(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/;
    }


    /**
     *
     */
    initializeModel(modelData) {
        return new MessageModel(modelData);
    }
}

module.exports = MessageGroup;