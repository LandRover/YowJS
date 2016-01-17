'use strict';

const payloadsList = [
    require('./payloads/message_private'),
    require('./payloads/message_group')
];

class Payload {
    constructor(payload) {
        this.payload = payload;
    }


    getPayload() {
        return this.payload;
    }


    get() {
        return this.normalizer();
    }


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
        for (let i = 0, len = payloadsList.length; i < len; i++) {
            let foundMatching = new payloadsList[i](message);

            if (false !== foundMatching.isItMe())
                return foundMatching;
        }

        return null;
    }

}

module.exports = Payload;