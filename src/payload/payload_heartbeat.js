'use strict';

let PayloadBase = require('./payload_base'),
    HeartbeatModel = require('../message/heartbeat_model');


/**
 * Heartbeat model Handles arriving heartbeat payloads and coverts them into a unified model structure.
 */
class Heartbeat extends PayloadBase {
    /**
     * Creates a proper instance of a heartbeat
     *
     * @param {Object} modelData
     * @return {HeartBeatModel} instance
     */
    initializeModel(modelData) {
        return new HeartbeatModel(modelData);
    }


    /**
     * Regex pattern for matching a heatbeat format.
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

module.exports = Heartbeat;