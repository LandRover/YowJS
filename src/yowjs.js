'use strict';

let cmd,
    spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter,
    onError = () => {},
    emitter = new EventEmitter().on('error', onError),

    EVENT = {
        ON_YOWSUP_RECEIVE: Symbol(),
        STATE_CHANGE: Symbol(),
        CHAT_RECEIVE: Symbol(),
        PAYLOAD_RECEIVE: Symbol(),
        YOWSUP_LINK_DEAD: Symbol()
    },

    RESPONSE = {
        CONNECTED: '[connected]:',
        OFFLINE: '[offline]:',
        AUTH_OK: 'Auth: Logged in!',
        AUTH_ERROR: 'Auth Error, reason not-authorized'
    },

    STATE = {
        ONLINE: Symbol(),
        OFFLINE: Symbol(),
        AUTH_ERROR: Symbol()
    };

class YowJS  {
    /**
     *
     */
    constructor() {
        this.cmdPrefix = '/';
        this.countryCode = null;
        this.phoneNumber = null;
        this.password = null;

        this.subscribe();
    }


    initialize(countryCode, phoneNumber, password) {
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.password = password;

        return this;
    }



    on(eventName, callback) {
        let event = EVENT[eventName];

        if ('undefined' === event) {
            console.log(['Error', 'Event not found', eventName]);

            return false;
        }

        emitter.on(event, callback);

        return this;
    }


    connect() {
        return this.runYowsup();
    }


    /**
     *
     */
    getCMDWithArgs() {
        return [
            '-u',
            '/usr/local/bin/yowsup-cli',
            'demos',
            '-d',
            '-y',
            '-l',
            this.getCredentials()
        ];
    }


    /**
     *
     */
    getCredentials() {
        return [
            this.countryCode,
            this.phoneNumber,
            ':',
            this.password
        ].join('');
    }


    getCMDPrefix() {
        return this.cmdPrefix;
    }


    doSay(to, text) {
        this.send([
            'message',
            'send',
            to,
            text
        ]);
    }


    doImage(to, path, caption) {
        this.send([
            'image',
            'send',
            to,
            path,
            caption
        ]);
    }


    doLogin() {
        return this.send('L');
    }


    send(args) {
        if (args instanceof Array) {
            args = args.join(' ');
        }

        let command = [
                this.getCMDPrefix(),
                args,
                '\n'
            ].join('');

        console.log('DEBUG: ' + command);

        cmd.stdin.write(command);
    }


    /**
     *
     */
    payloadMatch(payload) {
        let patterns = {
                message: /^\[(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/,             // [0000000000000@s.whatsapp.net(01-01-2016 01:01)]:[ABCDEF1234567890000]    Hi
                group: /^\[(\d+)\/(\d+)-(\d+)@.*\((.*)\).*\]:\[(.*)\]\t (.*)/   // [0000000000000/0000000000000-1234567890@g.us(01-01-2016 01:01)]:[ABCDEF1234567890000]     Hi
            },
            matchedPayload = null;

        Object.keys(patterns).forEach((idx) => {
            let match = payload.match(patterns[idx]);

            if (null !== match) {
                match.shift(); // removes the first field, the whole match
                matchedPayload = match;
            }
        });

        return matchedPayload;
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

        message.text = payload.pop();
        message.id = payload.pop();
        message.date = payload.pop();
        message.from = payload.shift();

        // date fix
        message.date = this.getDateObject(message.date);

        if (0 < payload.length) {
            message.type = 'group';
            message.to = payload.shift() +'-'+ payload.shift();
        }

        return message;
    }


    /**
     * Converts date string into proper Date object.
     *
     * @return {Date}
     */
    getDateObject(stringDate) {
        let pattern = /^([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)$/; // 01-01-2016 01:01
        let date = stringDate.match(pattern);
        date.shift(); // removes first match

        let year = date[2],
            month = parseInt(date[1])-1,
            day = date[0],
            hour = date[3],
            minute = date[4],
            seconds = 0,
            miliseconds = 0;

        return new Date(year, month, day, hour, minute, seconds, miliseconds);
    }


    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }


    /**
     *
     */
    runYowsup() {
        let args = this.getCMDWithArgs(),
            options = {cwd: __dirname};

        cmd = spawn('python', args, options);
        cmd.stdin.setEncoding('utf-8');

        cmd.stdout.on('data', message => {
            emitter.emit(EVENT.ON_YOWSUP_RECEIVE, message.toString().trim());
        });

        cmd.on('close', () => {
            this.onClose();
        });

        return this;
    }


    onClose() {
        emitter.emit(EVENT.YOWSUP_LINK_DEAD);
        console.log('CLOSED APP');
    }


    onReceive(payload) {
        switch(payload) {
            case RESPONSE.CONNECTED:
                break;

            case RESPONSE.OFFLINE:
                this.doLogin(); // sends login command
                break;

            case RESPONSE.AUTH_ERROR:
                emitter.emit(EVENT.STATE_CHANGE, STATE.AUTH_ERROR);
                break;

            case RESPONSE.AUTH_OK:
                emitter.emit(EVENT.STATE_CHANGE, STATE.ONLINE);
                break;

            default:
                let chatMsg = this.payloadNormalizer(payload);

                if (null !== chatMsg) {
                    emitter.emit(EVENT.CHAT_RECEIVE, chatMsg);
                } else {
                    emitter.emit(EVENT.PAYLOAD_RECEIVE, payload);
                }
        }


    }


    onStateChange(state) {
        switch(state) {
            case STATE.ONLINE:
                console.log('[*] ONLINE');
                break;

            case STATE.OFFLINE:
                console.log('[*] OFFLINE');
                break;

            case STATE.AUTH_ERROR:
                console.log('[*] AUTH ERROR');
                console.log(this);
                break;
        }
    }


    subscribe() {
        emitter.on(EVENT.ON_YOWSUP_RECEIVE, payload => {
            this.onReceive(payload);
        });


        emitter.on(EVENT.CHAT_RECEIVE, message => {
            //console.log(['message', message]);
        });

        emitter.on(EVENT.PAYLOAD_RECEIVE, payload => {
            //console.log(['payload', payload]);
        });

        emitter.on(EVENT.STATE_CHANGE, state => {
            this.onStateChange(state);
        });
    }

}

module.exports = YowJS;