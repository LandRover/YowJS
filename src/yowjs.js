'use strict';

let Logger = require('utils/logger'),
    EventEmitter = require('events').EventEmitter,
    Emitter = new EventEmitter().on('error', () => {
        Logger.log('error', '[YowJS::EventEmitter] Event fired error', arguments);
    }),

    EVENTS = require('../consts/events'),
    RESPONSES = require('../consts/responses'),
    STATES = require('../consts/states');

class YowJS  {
    /**
     *
     */
    constructor() {

    }


    on(eventName, callback) {
        let event = EVENTS[eventName];

        if ('undefined' === event) {
            console.log(['Error', 'Event not found', eventName]);

            return false;
        }

        Emitter.on(event, callback);

        return this;
    }


    connect() {
        return this.run();
    }
}

module.exports = YowJS;