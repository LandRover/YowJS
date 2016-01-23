'use strict';

const _ = require('lodash');


/**
 *
 */
class API {
    /**
     *
     */
    constructor(cmd, Logger, Emitter) {
        Logger.log('silly', '[API::Constructor] Initialized Constructor');

        _.extend(this, {
            cmd: cmd,
            cmdPrefix: '/',
            Logger: Logger,
            Emitter: Emitter
        });
    }


    /**
     *
     */
    say(to, text, callback) {
        this._send([
            'message',
            'send',
            to,
            '"'+ text +'"'
        ], callback);
    }


    /**
     *
     */
    image(to, path, caption, callback) {
        return this._send([
            'image',
            'send',
            to,
            path,
            caption
        ], callback);
    }


    /**
     *
     */
    login() {
        this._send('L');

        return setTimeout(() => {
            this.online(); // become online
        }, 0);
    }


    /**
     *
     */
    online(callback) {
        return this._send([
            'presence',
            'available'
        ], callback);
    }


    /**
     *
     */
    offline(callback) {
        return this._send([
            'presence',
            'unavailable'
        ], callback);
    }


    /**
     *
     */
    _send(args, callback) {
        if (_.isArray(args))
            args = args.join(' ');

        let command = [
                this.cmdPrefix,
                args,
                '\n'
            ].join('');

        this.Logger.log('info', '[YowsupRuntime::send] Sending API call to service', command);
        this.cmd.stdin.write(command);

        if ('function' === typeof(callback)) {
            setTimeout(() => {
                callback()
            });
        }
    }
}

module.exports = API;