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
        Logger.log('debug', '[API::Constructor] Initialized Constructor');

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
    say(to, text) {
        this._send([
            'message',
            'send',
            to,
            text
        ]);
    }


    /**
     *
     */
    image(to, path, caption) {
        return this._send([
            'image',
            'send',
            to,
            path,
            caption
        ]);
    }


    /**
     *
     */
    login() {
        return this._send('L');
    }


    /**
     *
     */
    online() {
        return this._send([
            'presence',
            'available'
        ]);
    }


    /**
     *
     */
    offline() {
        return this._send([
            'presence',
            'unavailable'
        ]);
    }


    /**
     *
     */
    _send(args) {
        if (_.isArray(args))
            args = args.join(' ');

        let command = [
                this.cmdPrefix,
                args,
                '\n'
            ].join('');

        this.Logger.log('info', '[YowsupRuntime::send] Sending API call to service', command);

        this.cmd.stdin.write(command);
    }
}

module.exports = API;