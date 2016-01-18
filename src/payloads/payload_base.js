'use strict';

class BasePayload {
    /**
     *
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
        return null !== this.getMessageModel();
    }


    /**
     * Initializes a model by regex matching.
     *
     * @return {Object} Message(Group/Private) instance - with a proper message type, when not matched, null.
     */
    getMessageModel() {
        // return cached model, if exists.
        if (null !== this.messageModel)
            return this.messageModel;

        // match pattern against payload received
        let matchPattern = this.regexMatch();

        // create a model, if match found.
        if (null !== matchPattern)
            return this.initializeModel(matchPattern);

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