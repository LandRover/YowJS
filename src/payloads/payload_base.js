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
     *
     */
    getMessageModel() {
        if (null !== this.messageModel)
            return this.messageModel;

        let model = this.payload.match(this.getPattern());

        if (null !== model)
            this.messageModel = this.initializeModel(model);

        return this.messageModel;
    }
}

module.exports = BasePayload;