'use strict';

const Logger = require('winston');

Logger.add(Logger.transports.File, {
    filename: "access.log"
});

Logger.remove(Logger.transports.Console);

module.exports = Logger;