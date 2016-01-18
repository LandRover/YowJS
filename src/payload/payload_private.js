'use strict';

let PayloadBase = require('./payload_base'),
      MessageModel = require('../message/message_model');


/**
 * MessagePrivate Handles private messages arrived.
 *
 * All messages that match the pattern below, will be instances of this class.
 * Also the payload is the gateway to the messages after parsing.
 */
class MessagePrivate extends PayloadBase {
    /**
     * Creates a proper instance of a the message (executed only if pattern matched)
     *
     * @param {Object} modelData
     * @return {MessageModel} instance
     */
    initializeModel(modelData) {
        return new MessageModel(modelData);
    }


    /**
     * Regex pattern for matching a private messages received
     * Matching pattern of example: [0987654321000@s.whatsapp.net(16-01-2016 00:59)]:[ABCDEF1234567890000]	 Hey You
     *
     * Structure:
     *   0987654321000: sent from
     *   s.whatsapp.net: private identifier
     *   16-01-2016 00:59: date
     *   ABCDEF1234567890000: msgid
     *   Hey You: text sent
     */
    getPattern() {
        return /^\[(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/;
    }
}

module.exports = MessagePrivate;