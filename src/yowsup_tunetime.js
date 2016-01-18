'use strict';

const _ = require('lodash'),
    cmd,
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
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.password = password;

        return this;
    }


    /**
     *
     */
    setCliPath(cliPath) {
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
        if (_.isArray(args)) {
            args = args.join(' ');
        }

        let command = [
                this.cmdPrefix,
                args,
                '\n'
            ].join('');

        console.log('DEBUG: ' + command);

        cmd.stdin.write(command);
    }
}

module.exports = YowsupRuntime;