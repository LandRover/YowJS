'use strict';

const payloads = [
    require('./payloads/message_private'),
    require('./payloads/message_group')
];

class Payload {
    constructor(message) {
        this.message = message;
    }
    
    
    payloadNormalizer(payload) {
        payload = this.payloadMatch(payload);

        let message = {
                type: 'message',
                id: null,
                from: null,
                to: null,
                date: null,
                text: null
            };

        if (null === payload) return payload;

        message.from = payload.shift();
        message.text = payload.pop();
        message.id = payload.pop();
        message.date = payload.pop();

        // date fix
        message.date = this.getDateObject(message.date);

        if (0 < payload.length) {
            message.type = 'group';
            message.to = payload.shift() +'-'+ payload.shift();
        }

        return message;
    }
    
    /**
     *
     */
    payloadMatch() {
        let patterns = this.getPatterns(),
            matchedPayload = null;

        payloads.forEach(payload => {
            let match = this.message.match(payload);

            if (null !== match) {
                match.shift(); // removes the first field, the whole match
                matchedPayload = match;
            }
        });

        return matchedPayload;
    }
    
}

module.exports = Payload;