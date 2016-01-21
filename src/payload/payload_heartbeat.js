'use strict';

let PayloadBase = require('./payload_base'),
      HeartbeatModel = require('../message/heartbeat_model');


/**
 * MessagePrivate Handles group messages arrived.
 *
 * All messages that match the pattern below, will be instances of this class.
 * Also the payload is the gateway to the messages after parsing.
 */
class HeartBeat extends PayloadBase {
    /**
     * Creates a proper instance of a heartbeat
     *
     * @param {Object} modelData
     * @return {MessageModel} instance
     */
    initializeModel(modelData) {
        return new HeartbeatModel(modelData);
    }


    /**
     * Regex pattern for matching a group message format.
     * Matching pattern of example: Iq:\nID: 99\nType: result\nfrom: 000000000000@s.whatsapp.net
     *
     * Structure:
     *   99: IQ
     *   result: Type
     *   000000000000: sent from
     *   s.whatsapp.net/g.us: group/private identifier
     */
    getPattern() {
        return /^.*:(.*)\n.*: ([0-9]+)\n.*: (.*)\n.*: (.*)@(.*)/;
    }
}

module.exports = HeartBeat;