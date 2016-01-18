'use strict';

const _ = require('lodash'),
      TYPES = require('./types');

class MessageBase {
    /**
     * Getter for the message type. If nothing found defaults to UNKNOWN message type.
     *
     * @return {Object} Symbol referance of that type.
     */
    getType() {
        return _.isEmpty(this.type) ? TYPES.UNKNOWN : this.type;
    }
}

module.exports = MessageBase;