/**
 * Events list, mapped to symbols.
 *
 * Used internally for the Emitter and also exposed as an external API for subscribing YowJS events.
 */
module.exports = {
    ON_MESSAGE: Symbol(), // Fired on text messages, group / private
    ON_MESSAGE_ANY: Symbol(), // Fired on any message type
    STATE_CHANGE: Symbol(), // State of the user changes. Becomes Offline/Online/AuthError
    PROCESS_CLOSED: Symbol() // Fired when executed service dies for some reason, relaunch required.
};