'use strict';

const _ = require('lodash'),
      EventEmitter = require('events').EventEmitter,
      EmitterDefault = new EventEmitter().on('error', () => {
          console.log(['[YowJS::EventEmitter] Event fired error', arguments]); // eslint-disable-line no-console
      }),

      EVENTS = require('./consts/events'),
      RESPONSES = require('./consts/responses'),
      STATES = require('./consts/states');


/**
 * YowJS
 */
class YowJS {
    /**
     * Initializes the DI
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
     * Initialize the required params to Login using Yowsup cli.
     *
     * @param {Number} countryCode - of the sim
     * @param {Number} phoneNumber - of the sim
     * @param {String} password - password generated from phone verification process, under the 'key' field.
     * @return {Object} YowJS instance, of this - for chaining.
     */
    initialize(countryCode, phoneNumber, password) {
        this.Runtime.setCredentials(countryCode, phoneNumber, password);

        return this;
    }


    /**
     * Getter for the Runtime commands API
     *
     * @return {Object} API instance, of the runtime wrapper enabling direc
     */
    send() {
        this.Logger.log('debug', '[YowJS::send] Getter for API was called');

        return this.Runtime.getAPI();
    }


    /**
     * on, allows subscribing to actions that are tramistted via events bus.
     *
     * @see: EVENTS object to see all actions.
     * @return {Object} YowJS instance, of this - for chaining.
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
     * Starts the process of Yowsup cli and begins the Runtime object.
     *
     * @return {Object} YowJS instance, of this - for chaining.
     */
    connect() {
        this.Logger.log('debug', '[YowJS::connect] Running runtime Python wrapper...');

        this.Runtime.run();

        return this;
    }
}

module.exports = YowJS;