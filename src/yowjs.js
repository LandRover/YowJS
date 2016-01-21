'use strict';

const _ = require('lodash'),
      EventEmitter = require('events').EventEmitter,
      EmitterDefault = new EventEmitter().on('error', () => {
          console.log(['[YowJS::EventEmitter] Event fired error', arguments]);
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
    constructor(Logger, Emitter, TestRuntime) {
        _.extend(this, {
            Logger: Logger || require('./utils/logger'), // bind default logger if not found external one.
            Emitter: Emitter || EmitterDefault, // bind default emitter
            Runtime: TestRuntime || require('./yowsup/runtime') // default bind to Runtime object, for testing.
        });

        this.Runtime = new this.Runtime(this.Logger, this.Emitter);
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
    say(to, text) {
        this.Logger.log('debug', '[YowJS::say] Saying to', to, text);

        this.Runtime.getAPI().say(to, text);

        return this;
    }


    /**
     *
     */
    image(to, path, caption) {
        this.Logger.log('debug', '[YowJS::image] Sending image to', to, path, caption);

        this.Runtime.getAPI().image(to, path, caption);

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