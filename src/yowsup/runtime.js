'use strict';

const _ = require('lodash'),
    API = require('./api'),
    Payload = require('../payload'),
    Spawn = require('child_process').spawn,

    TYPES = require('../message/types'),
    EVENTS = require('../consts/events'),
    RESPONSES = require('../consts/responses'),
    STATES = require('../consts/states');

/**
 *
 */
class Runtime {
    /**
     *
     */
    constructor(Logger, Emitter, TestAPI, TestPayload) {
        Logger.log('silly', '[Runtime::Constructor] Initialized Constructor');

        _.extend(this, {
            api: null,
            cmd: null,

            // cli cmd path
            cliPath: '/usr/local/bin/yowsup-cli',

            // credentials
            countryCode: null,
            phoneNumber: null,
            password: null,

            Logger: Logger,
            Emitter: Emitter,
            API: TestAPI || API, // bind fake API object, used for testing.
            Payload: TestPayload || Payload // bind fake Payload object, used for testing.
        });
    }


    /**
     *
     */
    setCredentials(countryCode, phoneNumber, password) {
        this.Logger.log('debug', '[Runtime::setCredentials] Setter for Credentials', arguments);

        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.password = password;

        return this;
    }


    /**
     *
     */
    setCliPath(cliPath) {
        this.Logger.log('debug', '[Runtime::setCliPath] Setter for Yowsup2-cli executable', arguments);

        this.cliPath = cliPath;

        return this;
    }


    /**
     *
     */
    getCMD() {
        return this.cmd;
    }


    getAPI() {
        if (null === this.api)
            this.api = new this.API(this.getCMD(), this.Logger);

        return this.api;
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


    /**
     *
     */
    getCMDWithArgs() {
        return [
            '-u',
            this.cliPath,
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
    run() {
        let args = this.getCMDWithArgs(),
            options = {cwd: __dirname};

        this.Logger.log('info', '[Runtime::run] Executing Python Yowsup2-cli deamon', args.join(' '), options);

        this.cmd = Spawn('python', args, options);
        this.cmd.stdin.setEncoding('utf-8');

        this.cmd.stdout.on('data', payload => {
            payload = payload.toString().trim();
            this.onReceive(payload);
        });

        this.cmd.on('close', () => {
            this.onClose();
        });

        return this;
    }


    onClose() {
        this.Logger.log('debug', '[Runtime::onClose] Close of the Runtime is called.');
    }


    onReceive(payload) {
        this.Logger.log('silly', '[Runtime::onReceive::entry] Raw Message arrived', payload);

        switch(payload) {
            case RESPONSES.CONNECTED:
                break;

            case RESPONSES.OFFLINE:
            case RESPONSES.OFFLINE_EXTENDED:
                this.getAPI().login(); // login
                break;

            case RESPONSES.AUTH_ERROR:
                this.onStateChange(STATES.AUTH_ERROR);
                break;

            case RESPONSES.AUTH_OK:
                this.onStateChange(STATES.ONLINE);
                break;

            default:
                let payloadMessage = new Payload(payload),
                    msg = payloadMessage.getMessage();

                this.Logger.log('debug', '[Runtime::onReceive::default] Raw Message arrived', [payload, payloadMessage, msg]);

                if (TYPES.UNKNOWN !== msg.getType())
                    this.Emitter.emit(EVENTS.ON_MESSAGE, msg);

                this.Emitter.emit(EVENTS.ON_MESSAGE_ANY, msg);
        }
    }


    onStateChange(state) {
        switch(state) {
            case STATES.ONLINE:
                this.Logger.log('warn', '[Runtime::onStateChange] [*] ONLINE');
                break;

            case STATES.OFFLINE:
                this.Logger.log('warn', '[Runtime::onStateChange] [*] OFFLINE');
                break;

            case STATES.AUTH_ERROR:
                this.Logger.log('error', '[Runtime::onStateChange] [*] AUTH_ERROR', this);
                break;
        }

        this.Emitter.emit(EVENTS.STATE_CHANGE, state);
    }
}

module.exports = Runtime;