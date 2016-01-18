'use strict';

const _ = require('lodash'),
      TYPES = require('./types');

class MessageBase {
    /**
     * Stores payload message on object
     */
    constructor(rawPayload) {
        this.rawPayload = rawPayload;
    }


    /**
     * Getter for the message type. If nothing found defaults to UNKNOWN message type.
     *
     * @return {Object} Symbol referance of that type.
     */
    getType() {
        return _.isNil(this.type) ? TYPES.UNKNOWN : this.type;
    }
}

module.exports = MessageBase;