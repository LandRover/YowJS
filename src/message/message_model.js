'use strict';

const _ = require('lodash'),
      MessageBase = require('./message_base'),
      TYPES = require('./types'),

      /**
       * Base message structure, matches added on-top of this base.
       *
       * @var {Object}
       */
      DEFAULT_MESSAGE = {
        type: TYPES.MESSAGE_PRIVATE, // defaults to PM
        id: null,
        from: null,
        to: null,
        date: null,
        text: null
      };

class MessageModel extends MessageBase {
    /**
     *
     */
    constructor(payload) {
        super();

        _.extend(
            this,
            this._initMessageModel(payload)
        );
    }


    /**
     *
     */
    _initMessageModel(payload) {
        let message = DEFAULT_MESSAGE;

        message.from = payload.shift();
        message.text = payload.pop();
        message.id = payload.pop();
        message.date = this.getDateObject(payload.pop());

        if (0 < payload.length) {
            message.type = TYPES.MESSAGE_GROUP;
            message.to = payload.shift() +'-'+ payload.shift();
        }

        return message;
    }


    /**
     * Converts date string into proper Date object.
     *
     * @return {Date}
     */
    getDateObject(stringDate) {
        let pattern = /^([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)$/; // 16-01-2016 01:16
        let date = stringDate.match(pattern);
        date.shift(); // removes first match

        let year = date[2],
            month = parseInt(date[1])-1,
            day = date[0],
            hour = date[3],
            minute = date[4],
            seconds = 0,
            miliseconds = 0;

        return new Date(year, month, day, hour, minute, seconds, miliseconds);
    }
}

module.exports = MessageModel;