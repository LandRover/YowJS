'use strict';

const _ = require('lodash');

/**
 * BasePayload.
 *
 * Is a shared logic between all the possible payloads in the system.
 * The differance for the indevidual payloads are the regex pattern and the Message object they create.
 */
class BasePayload {
    /**
     * Constructor for storing the payload.
     */
    constructor(payload) {
        this.payload = payload;
        this.messageModel = null;
    }


    /**
     * Validates the final result - if the current regex matches the text received in the payload.
     *
     * @return {Boolean}
     */
    isItMe() {
        return null !== this.getMessage();
    }


    /**
     * Initializes a model by regex matching.
     *
     * @return {Object} Message(Group/Private) instance - with a proper message type, when not matched, null.
     */
    getMessage() {
        // return cached model, if exists.
        if (null !== this.messageModel) {
            return this.messageModel;
        }

        // match pattern against payload received
        let matchPattern = this.regexMatch();

        // create a model, if match found.
        if (_.isArray(matchPattern)) {
            matchPattern.shift();

            return this.initializeModel(matchPattern);
        }

        return matchPattern;
    }


    /**
     * Matching regex against text
     *
     * @return {Mixed} Array or null if not matched
     */
    regexMatch() {
        return this.payload.match(this.getPattern());
    }

}

module.exports = BasePayload;