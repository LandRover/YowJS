'use strict';

const _ = require('lodash'),
      TYPES = require('./types'),
      IDENTIFIERS = require('../consts/identifiers');

class HeatBeatModel {
    /**
     * Initialize heartbeat
     */
    constructor(heartbeatPayload) {
        _.extend(
            this,
            this._initMessageModel(heartbeatPayload)
        );
    }


    /**
    * Getter for the base structure of an heartbeat.
    *
    * @return {Object}
    */
    getDefaultHeartbeat() {
        return {
            QI: null,
            ID: null,
            type: null,
            from: null,
            group: false
        };
    }


    /**
     * Message formatter.
     * Formats the MESSAGE by overriding the default values found at DEFAULT_MESSAGE.
     *
     * @param {Array} payload - parsed regex array received from the message.
     * @return {Object} message formated with the values extracted from the payload received.
     */
    _initMessageModel(payload) {
        if (!_.isArray(payload)) return null; // if not an array.. return.

        let heartbeat = this.getDefaultHeartbeat();

        heartbeat.QI = payload[0];
        heartbeat.ID = payload[1];
        heartbeat.type = payload[2];
        heartbeat.from = payload[3];
        heartbeat.group = this._isGroup(payload[4]);

        return heartbeat;
    }


    getType() {
        return TYPES.HEARTBEAT;
    }


    _isGroup(channel) {
        return IDENTIFIERS.GROUP === channel;
    }
}

module.exports = HeatBeatModel;