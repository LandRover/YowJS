'use strict';

const _ = require('lodash'),
    API = require('./api'),
    Payload = require('../payload'),
    Spawn = require('child_process').spawn,

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
    constructor(Logger, Emitter, options = {}) {
        Logger.log('debug', '[Runtime::Constructor] Initialized Constructor');

        _.extend(this, {
            cmd: null,

            // cli cmd path
            cliPath: '/usr/local/bin/yowsup-cli',

            // credentials
            countryCode: null,
            phoneNumber: null,
            password: null,

            api: new API(this.cmd, Logger),

            Logger: Logger,
            Emitter: Emitter
        },
        options);

        this.subscribe();
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

        this.Logger.log('info', '[Runtime::run] Executing Python Yowsup2-cli deamon', args, options);

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


    onReceive(payload) {
        this.Logger.log('silly', '[Runtime::onReceive::entry] Raw Message arrived', payload);

        switch(payload) {
            case RESPONSES.CONNECTED:
                break;

            case RESPONSES.OFFLINE:
                this.API.login(); // sends login command
                break;

            case RESPONSES.AUTH_ERROR:
                this.Emitter.emit(EVENTS.STATE_CHANGE, STATES.AUTH_ERROR);
                break;

            case RESPONSES.AUTH_OK:
                this.Emitter.emit(EVENTS.STATE_CHANGE, STATES.ONLINE);
                break;

            default:
                let payloadMessage = new Payload(payload),
                    msg = payloadMessage.getMessage();

                this.Logger.log('debug', '[Runtime::onReceive::default] Raw Message arrived', payload, payloadMessage, msg);

                this.Emitter.emit(EVENTS.ON_MESSAGE, msg);
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
    }


    subscribe() {
        this.Emitter.on(EVENTS.ON_MESSAGE, message => {
            console.log(['message', message]);
        });

        this.Emitter.on(EVENTS.STATE_CHANGE, state => {
            this.onStateChange(state);
        });
    }
}

module.exports = Runtime;