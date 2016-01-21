'use strict';

const _ = require('lodash'),
      TYPES = require('./types'),
      IDENTIFIERS = require('../consts/identifiers');


class StateChangedModel {
    /**
     * Initialize state changed model
     */
    constructor(stateChangedPayload) {
        _.extend(
            this,
            this._initStateChangedModel(stateChangedPayload)
        );
    }


    /**
    * Getter for the base structure of an state_changed.
    *
    * @return {Object}
    */
    getDefaultStateChanged() {
        return {
            state: null,
            from: null,
            group: false
        };
    }


    /**
     * Message formatter.
     * Formats the STATE_CHANGED by overriding the default values found at DEFAULT.
     *
     * @param {Array} payload - parsed regex array received from the state_changed message.
     * @return {Object} message formated with the values extracted from the payload received.
     */
    _initStateChangedModel(payload) {
        if (!_.isArray(payload)) return null; // if not an array.. return.

        let stateChanged = this.getDefaultStateChanged();

        stateChanged.state = payload[0];
        stateChanged.type = payload[1];
        stateChanged.group = this._isGroup(payload[2]);

        return stateChanged;
    }


    getType() {
        return TYPES.STATE_CHANGED;
    }


    _isGroup(channel) {
        return IDENTIFIERS.GROUP === channel;
    }
}

module.exports = StateChangedModel;