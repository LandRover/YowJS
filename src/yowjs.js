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
     * Say is a gateway to the API allowing sending a text message to a phone number.
     *
     * @param {String} to - Phone number that will get the message.
     * @param {String} text - of the message that will be sent.
     * @return {Object} YowJS instance, of this - for chaining.
     */
    say(to, text) {
        this.Logger.log('debug', '[YowJS::say] Saying to', to, text);

        this.Runtime.getAPI().say(to, text);

        return this;
    }


    /**
     * Image - allows sending an image to a phone number.
     *
     * @param {String} to - Phone number that will get the message.
     * @param {String} path - unix path to the image, must be valid and existing path to proceed (validated inside API.)
     * @param {String} caption - is optional caption of the image. Will be attached if defined.
     * @return {Object} YowJS instance, of this - for chaining.
     */
    image(to, path, caption) {
        this.Logger.log('debug', '[YowJS::image] Sending image to', to, path, caption);

        this.Runtime.getAPI().image(to, path, caption);

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