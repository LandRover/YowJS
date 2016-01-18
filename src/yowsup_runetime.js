'use strict';

let cmd;
const _ = require('lodash'),
    Logger = require('./logger'),
    spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter,
    onError = () => {},
    emitter = new EventEmitter().on('error', onError),
    EVENTS_LIST = require('./consts/events_list');


/**
 *
 */
class YowsupRuntime {
    /**
     *
     */
    constructor() {
        Logger.log('debug', '[YowsupRuntime::Constructor] Initialized Constructor');

        _.extend(this, {
            // cli cmd path
            cliPath: '/usr/local/bin/yowsup-cli',
            cmdPrefix: '/',

            // credentials
            countryCode: null,
            phoneNumber: null,
            password: null
        });
    }


    /**
     *
     */
    setCredentials(countryCode, phoneNumber, password) {
        Logger.log('debug', '[YowsupRuntime::setCredentials] Setter for Credentials', arguments);

        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.password = password;

        return this;
    }


    /**
     *
     */
    setCliPath(cliPath) {
        Logger.log('debug', '[YowsupRuntime::setCliPath] Setter for Yowsup2-cli executable', arguments);

        this.cliPath = cliPath;

        return this;
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

        Logger.log('debug', '[YowsupRuntime::run] Executing Python Yowsup2-cli deamon', args, options);

        cmd = spawn('python', args, options);
        cmd.stdin.setEncoding('utf-8');

        cmd.stdout.on('data', message => {
            emitter.emit(EVENTS_LIST.ON_YOWSUP_RECEIVE, message.toString().trim());
        });

        cmd.on('close', () => {
            this.onClose();
        });

        return this;
    }


    /**
     *
     */
    send(args) {
        if (_.isArray(args))
            args = args.join(' ');

        let command = [
                this.cmdPrefix,
                args,
                '\n'
            ].join('');

        Logger.log('debug', '[YowsupRuntime::send] Sending API call to service', command);

        cmd.stdin.write(command);
    }
}

module.exports = YowsupRuntime;