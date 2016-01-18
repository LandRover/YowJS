'use strict';


const payloadTypes = [
          require('./payload/payload_private'),
          require('./payload/payload_group')
      ],
      MessageBase = require('./message/message_base');

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
        let payload = this.findMatch();

        if (null === payload)
            return new MessageBase({raw: this.payload});

        return payload.getMessageModel();
    }


    /**
     *
     */
    findMatch() {
        for (let i = 0, len = payloadTypes.length; i < len; i++) {
            let type = new payloadTypes[i](this.payload);

            if (false !== type.isItMe())
                return type;
        }

        return null;
    }

}

module.exports = Payload;