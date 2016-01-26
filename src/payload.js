'use strict';

const payloadTypes = [
          require('./payload/payload_private'),
          require('./payload/payload_group'),
          require('./payload/payload_heartbeat'),
          require('./payload/payload_confirmation'),
          require('./payload/payload_state_changed')
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
        this.message = null;
    }


    /**
     * Getter for the message
     *
     * @return {Message} object, matched by the payload regex settings
     */
    getMessage() {
        if (null !== this.message) {
            return this.message; // return cached response.
        }

        let payload = this.findPayloadByType(),
            message = null;



        if (null !== payload) {
            message = payload.getMessage();
        } else {
            message = new MessageBase({
                payload: this.payload
            });
        }

        this.message = message;

        return message;
    }


    /**
     * Match payload to a payloadType
     *
     * @return {Payload} object, according to the matched response type.
     */
    findPayloadByType() {
        for (let i = 0, len = payloadTypes.length; i < len; i++) {
            let type = new payloadTypes[i](this.payload);

            if (false !== type.isItMe()) {
                return type;
            }
        }

        return null;
    }
}

module.exports = Payload;