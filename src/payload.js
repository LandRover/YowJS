'use strict';

const payloadTypes = [
    require('./payload/message_private'),
    require('./payload/message_group')
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
    get() {
        return this.normalizer();
    }


    /**
     *
     */
    normalizer() {
        let payload = this.findMatch(this.payload);

        if (null === payload)
            return payload;

        return payload.getMessageModel();
    }


    /**
     *
     */
    findMatch(message) {
        for (let i = 0, len = payloadTypes.length; i < len; i++) {
            let type = new payloadTypes[i](message);

            if (false !== type.isItMe())
                return type;
        }

        return null;
    }

}

module.exports = Payload;