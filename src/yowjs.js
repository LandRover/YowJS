'use strict';

const _ = require('lodash'),
      LoggerUtil = require('./utils/logger'),
      Runtime = require('./yowsup/runtime'),
      EventEmitter = require('events').EventEmitter,
      Emitter = new EventEmitter().on('error', () => {
          LoggerUtil.log('error', '[YowJS::EventEmitter] Event fired error', arguments);
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
    constructor(Logger, options) {
        Logger = Logger || LoggerUtil; // bind default logger if not found external one.

        _.extend(this, {
            Logger: Logger,
            Emitter: Emitter,
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

        return this.Runtime.run();
    }
}

module.exports = YowJS;