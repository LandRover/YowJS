'use strict';


const payloadTypes = [
          require('./payload/payload_private'),
          require('./payload/payload_group')
      ],
      MessageBase = require('./message/message_base');

/**
 * Playload.
 *
 * Represents the incoming payloads sent externally and matching the proper message Objects.
 * Each payload arriving is initialized into a Payload object.
 */
class Payload {
    /**
     * Constructor method that stores the payload locally.
     */
    constructor(payload) {
        this.payload = payload;
    }


    /**
     * Getter for the message
     *
     * @return {Message} object, matched by the payload regex settings
     */
    getMessage() {
        var payload = this.findPayloadByType();

        if (null !== payload)
            return payload.getMessage();

        return new MessageBase({
            payload: this.payload
        });
    }


    /**
     * Match payload to a payloadType
     *
     * @return {Payload} object, according to the matched response type.
     */
    findPayloadByType() {
        for (let i = 0, len = payloadTypes.length; i < len; i++) {
            let type = new payloadTypes[i](this.payload);

            if (false !== type.isItMe())
                return type;
        }

        return null;
    }

}

module.exports = Payload;