'use strict';

let chai = require('chai'),
    expect = chai.expect,
    TYPES = require('../src/message/types'),
    Payload = require('./../src/payload.js'),
    PayloadPrivate = require('./../src/payload/payload_private'),
    PayloadGroup = require('./../src/payload/payload_group');

let MSG_POOL = {
    INVALID_FORMAT: 'it is invalid message format',
    MESSAGE_GROUP_TEXT: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t Hi there',
    MESSAGE_GROUP_AUDIO: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type:audio, Size:8000, URL:https://mmi000.whatsapp.net/d/RANDOM-STUFF/ABCD5435345345435435345.aac]',
    MESSAGE_GROUP_IMAGE: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type:image, Size:9000, URL:https://mmi000.whatsapp.net/d/RANDOM-STUFF/ABCD5435345345435435345.jpg]',
    MESSAGE_GROUP_LOCATION: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type: location]',
    MESSAGE_GROUP_CONTACT: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type: vcard]',
    MESSAGE_PRIVATE_TEXT: '[0987654321000@s.whatsapp.net(16-01-2016 00:59)]:[ABCDEF1234567890000]\t Hi',
    MESSAGE_CONFIRMATION: 'Message ABCDEF1234567890ABC: Sent delivered receipt and Read\n[connected]:',
    HEARTBEAT: 'Iq:\nID: 99\nType: result\nfrom: 000000000000@s.whatsapp.net'
};

describe('Payload', () => {

    it('returns a string', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_GROUP_TEXT);

        var t = payload.getMessage().getType();
        console.log(t === TYPES.UNKNOWN);

        expect(payload).to.equal(payload);

    });
});