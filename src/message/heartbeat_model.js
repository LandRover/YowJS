'use strict';

const TYPES = require('./../consts/types'),
      IDENTIFIERS = require('../consts/identifiers');


class HeatbeatModel {
    /**
     * Initialize heartbeat
     */
    constructor(heartbeatPayload) {
        Object.assign(
            this,
            this._initHeartbeatModel(heartbeatPayload)
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
     * Formats the HEARTBEAT by overriding the default values found at DEFAULT.
     *
     * @param {Array} payload - parsed regex array received from the heartbeat message.
     * @return {Object} message formated with the values extracted from the payload received.
     */
    _initHeartbeatModel(payload) {
        if (!Array.isArray(payload)) {return null;} // if not an array.. return.

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

module.exports = HeatbeatModel;