/**
 * Possible states of the connection, passed via emit when state changes.
 */
module.exports = {
    ONLINE: Symbol(),
    OFFLINE: Symbol(),
    AUTH_ERROR: Symbol()
};