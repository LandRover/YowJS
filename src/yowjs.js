'use strict';

const _ = require('lodash'),
      LoggerDefault = require('./utils/logger'),
      RuntimeYowsup = require('./yowsup/runtime'),
      EventEmitter = require('events').EventEmitter,
      EmitterDefault = new EventEmitter().on('error', () => {
          LoggerDefault.log('error', '[YowJS::EventEmitter] Event fired error', arguments);
      }),

      EVENTS = require('./consts/events'),
      RESPONSES = require('./consts/responses'),
      STATES = require('./consts/states');


/**
 *
 */
class YowJS {
    /**
     *
     */
    constructor(Logger, Emitter, Runtime) {
        Emitter = Emitter || EmitterDefault; // bind default emitter
        Logger = Logger || LoggerDefault; // bind default logger if not found external one.
        Runtime = Runtime || RuntimeYowsup; // bind fake Runtime object, used for testing.

        _.extend(this, {
            Logger: Logger,
            Emitter: Emitter,
            Runtime: new Runtime(Logger, Emitter)
        });
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
        let e = EVENTS[eventName];

        if ('undefined' === e) {
            this.Logger.log('error', '[YowJS::on] Event not found', eventName);

            return false;
        }

        this.Emitter.on(e, callback);
        this.Logger.log('silly', '[YowJS::on] Event subscribed', eventName);

        return this;
    }


    /**
     *
     */
    connect() {
        this.Logger.log('debug', '[YowJS::connect] Running runtime Python wrapper...');

        this.Runtime.run();

        return this;
    }
}

module.exports = YowJS;