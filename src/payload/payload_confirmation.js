'use strict';

let PayloadBase = require('./payload_base'),
      ConfirmationModel = require('../message/confirmation_model');


/**
 * Confirmation payload is received when a message have been viewed by an indevidual or the whole group.
 */
class Confirmation extends PayloadBase {
    /**
     * Creates a proper instance of a heartbeat
     *
     * @param {Object} modelData
     * @return {HeartBeatModel} instance
     */
    initializeModel(modelData) {
        return new ConfirmationModel(modelData);
    }


    /**
     * Regex pattern for matching a heatbeat format.
     * Matching pattern of example: Message ABCDEF1234567890ABC: Sent delivered receipt and Read\n[connected]:
     *
     * Structure:
     *   ABCDEF1234567890ABC: ID
     */
    getPattern() {
        return /^.* (.*):/;
    }
}

module.exports = Confirmation;