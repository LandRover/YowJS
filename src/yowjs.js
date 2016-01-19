'use strict';

let _ = require('lodash'),
    Logger = require('utils/logger'),
    Runtime = require('yowsup/runtime'),
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
    constructor(options = {}) {
        _.extend(this, {
            Runtime: new Runtime(Logger, Emitter)
        }, options);
    }


    /**
     *
     */
    initialize(countryCode, phoneNumber, password) {
        this.Runtime.setCredentials(countryCode, phoneNumber, password);

        return this;
    }


    /**
     *
     */
    on(eventName, callback) {
        let event = EVENTS[eventName];

        if ('undefined' === event) {
            this.Logger.log('error', '[YowJS::on] Event not found', event);

            return false;
        }

        Emitter.on(event, callback);
        this.Logger.log('silly', '[YowJS::on] Event fired', event, callback);

        return this;
    }


    /**
     *
     */
    connect() {
        this.Logger.log('debug', '[YowJS::connect] Running runtime Python wrapper...');

        return this.Runtime.run();
    }
}

module.exports = YowJS;