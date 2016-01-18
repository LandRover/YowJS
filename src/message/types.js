const MESSAGE_TYPES = {
    MESSAGE_PRIVATE: Symbol(),
    MESSAGE_GROUP: Symbol(),
    CONFIRMATION: Symbol(),
    HEARTBEAT: Symbol(),
    UNKNOWN: Symbol()
};

module.exports = MESSAGE_TYPES;