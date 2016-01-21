'use strict';

let PayloadBase = require('./payload_base'),
    StateChangedModel = require('../message/state_changed_model');


/**
 * StateChanged payload is received when a user start/pause typing
 */
class StateChanged extends PayloadBase {
    /**
     * Creates a proper instance of a heartbeat
     *
     * @param {Object} modelData
     * @return {StateChangedModel} instance
     */
    initializeModel(modelData) {
        return new StateChangedModel(modelData);
    }


    /**
     * Regex pattern for matching a state changed format.
     * Matching pattern of example: CHATSTATE:\nState: paused\nFrom: 000000000000-1234567890@g.us
     *
     * Structure:
     *   paused: State
     *   000000000000-1234567890: from
     *   s.whatsapp.net/g.us: group/private identifier
     */
    getPattern() {
        return /^CHATSTATE:\n.*: (.*)\n.*: (.*)@(.*)/;
    }
}

module.exports = StateChanged;