'use strict';

const messageTypes = [
    require('./payloads/message_private'),
    require('./payloads/message_group')
];

/**
 *
 */
class Payload {
    /**
     *
     */
    constructor(payload) {
        this.payload = payload;
    }


    /**
     *
     */
    getPayload() {
        return this.payload;
    }


    /**
     *
     */
    get() {
        return this.normalizer();
    }


    /**
     *
     */
    normalizer() {
        let payload = this.findMatchingPayload(this.getPayload());

        if (null === payload)
            return payload;

        return payload.getMessageModel();
    }


    /**
     *
     */
    findMatchingPayload(message) {
        for (let i = 0, len = messageTypes.length; i < len; i++) {
            let type = new messageTypes[i](message);

            if (false !== type.isItMe())
                return type;
        }

        return null;
    }

}

module.exports = Payload;