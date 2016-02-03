'use strict';

const API = require('./api'),
      Payload = require('../payload'),
      Spawn = require('child_process').spawn,

      TYPES = require('../consts/types'),
      EVENTS = require('../consts/events'),
      RESPONSES = require('../consts/responses'),
      STATES = require('../consts/states');


/**
 * Runtime is the middleware to the Python and used as the abstraction that communicates over STDIN && STDOUT.
 *
 * All communication on arriving/sent data to the middleware is done via event Emitter object.
 *
 * Object is also cover by tests and most of the constructor params are exposing the option to override all of them, in regular
 * case only Logger and Emitter are required to be passed in to initialized.
 */
class Runtime {
    /**
     * Runtime constructor object.
     * Contains default values for initializing the runtime process.
     *
     * Most of the params are exposed for the soul purpose of testing.
     *
     * @param {Object} Logger - Instance of the logger used to log all the needed info.
     * @param {Object} Emitter - Instance of the event manager, passed exteranlly to allow singularity and testing.
     * @param {Object} TestAPI - Instance of an API object, exposed for testing only. In regular case will take API from CONSTS
     * @param {Object} TestPayload - Instance of an Payload object, exposed for testing only. In regular case will take Payload from CONSTS
     * @param {Object} TestSpawn - Instance of an Spawn object, exposed for testing only. In regular case will take Spawn from CONSTS
     */
    constructor(Logger, Emitter, TestAPI, TestPayload, TestSpawn) {
        Logger.log('silly', '[Runtime::Constructor] Initialized Constructor');

        Object.assign(this, {
            api: null,
            cmd: null,

            cliPath: '/usr/local/bin/yowsup-cli', // default yowsup cli path

            // credentials
            countryCode: null,
            phoneNumber: null,
            password: null,

            Logger: Logger,
            Emitter: Emitter,
            Spawn: TestSpawn || Spawn, // bind fake Spawn object, used for testing.
            API: TestAPI || API, // bind fake API object, used for testing.
            Payload: TestPayload || Payload // bind fake Payload object, used for testing.
        });
    }


    /**
     * Stores the Yowsup required information to perform a login.
     *
     * @param {Number} countryCode - Country code of the sim, 3 chars max, not padded. Example: 44
     * @param {Number} phoneNumber - Phone number of the sim, deducting the country code and the leading 0. Example: 1234567890
     * @param {String} password - Expects base64 string to login with. Not verifition is performed here on the value, only passing.
     */
    setCredentials(countryCode, phoneNumber, password) {
        this.Logger.log('debug', '[Runtime::setCredentials] Setter for Credentials', arguments);

        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.password = password;

        return this;
    }


    /**
     * Setter for the Yowsup CLI path, needs to be set if custom installed in diffrent place the the
     *
     * @param {String} cliPath - Custom path to yowsup-cli
     */
    setCliPath(cliPath) {
        this.Logger.log('debug', '[Runtime::setCliPath] Setter for Yowsup2-cli executable', arguments);

        this.cliPath = cliPath;

        return this;
    }


    /**
     * Getter for the cmd, used to get access to STD IN/OUT
     *
     * @return {Object} Spawn referance to the process.
     */
    getCMD() {
        if (null === this.cmd) {
            this.run();
        }

        return this.cmd;
    }


    /**
     * Getter for the API instance.
     * Stores a cached API, prevents dual invoking.
     *
     * @return {Object} API Instance
     */
    getAPI() {
        if (null === this.api) {
            this.api = new this.API(this.getCMD(), this.Logger);
        }

        return this.api;
    }


    /**
     * Getter for the user credentials, formats data.
     * Login is expected to be in CCPHONE:PWD. Example: 441234567890:RAMDONPASSWORDHERE
     *
     * @return {String} of the LOGIN cmd that Yowsup expects
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
     * Getter for the Yowsup-cli arguments that needs to be passed in
     *
     * @return {String} of arguments that execute the process of the Python and Yowsup-cli
     */
    getCMDWithArgs() {
        return [
            '-u', // Python flag for unbuffered binary stdout and stderr
            this.cliPath, // path to yowsup-cli python file
            'demos',
            // '--debug', // Show debug messages, Default: commented out, disabled.
            '--yowsup', // Start the Yowsup command line client
            '--login', // login flag
            this.getCredentials() // phone:b64password
        ];
    }


    /**
     * Run forest run.
     *
     * Executes the process of Yowsup, with all the params baked in, calls a method, onReceive, on
     * any incoming message on STDOUT.
     *
     * @return {Object} self, for chaining.
     */
    run() {
        let args = this.getCMDWithArgs(),
            options = {cwd: __dirname};

        this.Logger.log('info', '[Runtime::run] Executing Python Yowsup2-cli deamon', args.join(' '), options);
        this.cmd = this.Spawn('python', args, options); // eslint-disable-line new-cap
        this.cmd.stdin.setEncoding('utf-8');

        this.Logger.log('info', '[Runtime::run] Spawn new process of Python, PID:', this.cmd.pid);

        this.cmd.stdout.on('data', payload => {
            payload = payload.toString().trim();
            this._onReceive(payload);
        });

        this.cmd.on('close', () => {
            this._onClose();
        });

        return this;
    }


    /**
     * onClose event callback when process is dead / closed.
     */
    _onClose() {
        this.Logger.log('debug', '[Runtime::onClose] PROCESS CLOSED, Firing event.');
        this.Emitter.emit(EVENTS.PROCESS_CLOSED);
    }


    /**
     * onReceive is the main entry for all incoming messages from the process.
     * It executed when something is written via the STDOUT and coverts it to a message
     *
     * Events that may come out, if matched properly:
     *   1. ON_MESSAGE - fired only when a message type is detected and message type is NOT TYPES.UNKNOWN.
     *   2. ON_MESSAGE_ANY - fired always, even if match is not found will broadcast this event of any type of message.
     *
     * Most of communicated should be via ON_MESSAGE, which are the proper types that are mainly used.
     * Events sent over ON_MESSAGE_ANY are mostly used for debugged or binding to an un-supported message type.
     *
     * @param {String} payload - incoming string from STDOUT of the process it binded to.
     */
    _onReceive(payload) {
        this.Logger.log('silly', '[Runtime::_onReceive::entry] Raw Message arrived', payload);

        switch (payload) {
            case RESPONSES.CONNECTED:
                break;

            case RESPONSES.OFFLINE:
            case RESPONSES.OFFLINE_EXTENDED:
                this.getAPI().login(); // login
                break;

            case RESPONSES.AUTH_ERROR:
                this._onStateChange(STATES.AUTH_ERROR);
                break;

            case RESPONSES.AUTH_OK:
                this._onStateChange(STATES.ONLINE);
                break;

            default:
                let payloadMessage = new this.Payload(payload),
                    msg = payloadMessage.getMessage();

                this.Logger.log('debug', '[Runtime::_onReceive::default] Raw Message arrived', payload);

                if (TYPES.UNKNOWN !== msg.getType()) {
                    this.Emitter.emit(EVENTS.ON_MESSAGE, msg);
                }

                this.Emitter.emit(EVENTS.ON_MESSAGE_ANY, msg);
        }
    }


    /**
     * Executed when the user state is changed, based on a list of agreed states at STATES
     * 3 main types are Online, Offline and Auth error which the events are broadcast accordingly
     * allowing the user of the API to decide on the approprite action.
     *
     * @param {Symbol} state of the changed state to.
     */
    _onStateChange(state) {
        switch (state) {
            case STATES.ONLINE:
                this.Logger.log('warn', '[Runtime::onStateChange] [*] ONLINE');
                break;

            case STATES.OFFLINE:
                this.Logger.log('warn', '[Runtime::onStateChange] [*] OFFLINE');
                break;

            case STATES.AUTH_ERROR:
                this.Logger.log('error', '[Runtime::onStateChange] [*] AUTH_ERROR');
                break;
        }

        this.Emitter.emit(EVENTS.STATE_CHANGE, state);
    }
}

module.exports = Runtime;