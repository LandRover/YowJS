/**
 * Message models types list.
 *
 * Matched by the type of a payload that arrives from the CLI via STDOUT input from the Runtime.
 */
module.exports = {
    MESSAGE_PRIVATE: Symbol(), // Group chat message
    MESSAGE_GROUP: Symbol(), // Private message
    CONFIRMATION: Symbol(), // Confirmation on a sent message
    STATE_CHANGED: Symbol(), // State of the user changes, Example types: Starts typing, pauses typing etc.
    HEARTBEAT: Symbol(), // Ping to the server, once X seconds. Sent automaticly via Yowsap cli.
    UNKNOWN: Symbol() // Undefined type of message, usually a type that we didn't map to a valid model.
};