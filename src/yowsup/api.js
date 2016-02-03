'use strict';

const fs = require('fs');


/**
 * API.
 *
 * Executing commands on the Yowsup CLI. Tightly depenended on the process reference(this.cmd) that needs to be passed in as a DI.
 * Consumed internally via Runtime objects.
 *
 * @note: Not all methods origianlly methods that exist in the yowsup-cli implemented here, but that's the place for them.
 */
class API {
    /**
     * Initialize the API method.
     * All referances are exposed for testing and DI.
     *
     * @param {Object} cmd - instance of an active Spawn of a process (Able to accept STDIN input.)
     * @param {Object} Logger - instance of an initliazed logger to output to.
     */
    constructor(cmd, Logger) {
        Logger.log('silly', '[API::Constructor] Initialized Constructor');

        Object.assign(this, {
            cmd: cmd,
            Logger: Logger
        });
    }


    /**
     * Say text
     *
     * @param {String} to - addressee phone number, including the country code.
     * @param {String} text - the text that will be sent to the user.
     * @return {Promise} of the action state
     */
    say(to, text) {
        // escaping quotes
        text = text.replace('"', "''"); // eslint-disable-line quotes

        return this._send([
            'message',
            'send',
            to,
            '"' + text + '"'
        ]);
    }


    /**
     * Image - Sends an image to a recipient
     *
     * @param {String} to - addressee phone number, including the country code.
     * @param {String} path - of a valid image of the accepted types. path must exist prior the accessing of the API.
     * @param {String} caption - description of the image
     * @return {Promise} of the action state
     */
    image(to, path, caption) {
        if (!fs.existsSync(path)) {
            this.Logger.log('error', '[API::image] Skipping action, Can NOT locate image path', path);

            return false;
        }

        return this._send([
            'image',
            'send',
            to,
            path,
            caption
        ]);
    }


    /**
     * Login - Sends a login action to the CLI and changes the state to Online when done.
     *
     * @return {Promise} of the action state
     */
    login() {
        return this._send('L').then(() => {
            this.online(); // become online
        });
    }


    /**
     * Online - Becomes publicly online
     *
     * @return {Promise} of the action state
     */
    online() {
        return this._send([
            'presence',
            'available'
        ]);
    }


    /**
     * Offline - Becomes publicly offline
     *
     * @return {Promise} of the action state
     */
    offline() {
        return this._send([
            'presence',
            'unavailable'
        ]);
    }


    /**
     * Sends the data to the Yowsup CLI.
     * The actual one method that does something at this class :)
     *
     * @param {Array} args - the params that needs to be passed to the CLI, in an array format to be concatinated to the actaul command.
     * @return {Promise} after the action is executed.
     */
    _send(args) {
        if (Array.isArray(args)) {
            args = args.join(' ');
        }

        let command = [
                '/', // cmd prefix, example: /message
                args,
                '\n'
            ].join('');

        this.Logger.log('info', '[YowsupRuntime::send] Sending API call to service', command);
        this.cmd.stdin.write(command); // @todo: figure a proper way to get a callback when action successfully called.

        return new Promise((fulfill) => {
            setTimeout(() => {
                fulfill();
            });
        });
    }
}

module.exports = API;