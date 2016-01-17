'use strict';

let extend = require('xtend');

class Message {
    
    constructor(payload) {
        extend(this, this._initMessageModel(payload));
    }
    
    
    _initMessageModel(payload) {
        let message = this.getDefaultMessage();
        
        message.from = payload.shift();
        message.text = payload.pop();
        message.id = payload.pop();
        message.date = this.getDateObject(payload.pop());

        if (0 < payload.length) {
            message.type = 'group';
            message.to = payload.shift() +'-'+ payload.shift();
        }
        
        return message;
    }
    
    
    /**
     * 
     */
    getDefaultMessage() {
        return {
            type: 'message',
            id: null,
            from: null,
            to: null,
            date: null,
            text: null
        };
    }
    
    
    /**
     * Converts date string into proper Date object.
     *
     * @return {Date}
     */
    getDateObject(stringDate) {
        let pattern = /^([0-9]+)-([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)$/; // 01-01-2016 01:01
        let date = stringDate.match(pattern);
        date.shift(); // removes first match

        let year = date[2],
            month = parseInt(date[1])-1,
            day = date[0],
            hour = date[3],
            minute = date[4],
            seconds = 0,
            miliseconds = 0;

        return new Date(year, month, day, hour, minute, seconds, miliseconds);
    }
}

module.exports = Message;