'use strict';

const _ = require('lodash'),
      MessageBase = require('./message_base'),
      TYPES = require('./../consts/types');

class MessageModel extends MessageBase {
    /**
     * Initialize Message from payload data into the current this.
     */
    constructor(rawPayload) {
        super(rawPayload);

        _.extend(
            this,
            this._initMessageModel(this.rawPayload)
        );
    }


    /**
    * Getter for Base message structure, matches added on-top of this base.
    *
    * @return {Object}
    */
    getDefaultMessage() {
        return {
            type: TYPES.MESSAGE_PRIVATE, // defaults to PM
            id: null,
            from: null,
            to: null,
            date: null,
            text: null
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
        if (!_.isArray(payload)) {return null;} // if not an array.. return.

        let message = this.getDefaultMessage();

        message.from = payload.shift();
        message.text = payload.pop();
        message.id = payload.pop();
        message.date = this.stringToDate(payload.pop());

        if (0 < payload.length) {
            message.type = TYPES.MESSAGE_GROUP;
            message.to = payload.shift() + '-' + payload.shift();
        }

        return message;
    }


    /**
     * Converts date string into proper Date object.
     *
     * @return {Date}
     */
    stringToDate(stringDate) {
        let pattern = /^([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)$/; // 16-01-2016 00:59
        let date = stringDate.match(pattern);
        date.shift(); // removes first match

        let year = date[2],
            month = parseInt(date[1]) - 1,
            day = date[0],
            hour = date[3],
            minute = date[4],
            seconds = 0,
            miliseconds = 0;

        return new Date(year, month, day, hour, minute, seconds, miliseconds);
    }
}

module.exports = MessageModel;