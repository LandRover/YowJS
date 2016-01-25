'use strict';

let chai = require('chai'),
    expect = chai.expect,
    TYPES = require('../src/consts/types'),
    Payload = require('./../src/payload.js');

let MSG_POOL = {
    NOT_SUPPORTED_FORMAT: '[ABCDEF1234567890000] it is invalid message format',
    INVALID_FORMAT: 'it is invalid message format',
    MESSAGE_GROUP_TEXT: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t Hi group!',
    MESSAGE_GROUP_AUDIO: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type:audio, Size:8000, URL:https://mmi000.whatsapp.net/d/RANDOM-STUFF/ABCD5435345345435435345.aac]',
    MESSAGE_GROUP_IMAGE: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type:image, Size:9000, URL:https://mmi000.whatsapp.net/d/RANDOM-STUFF/ABCD5435345345435435345.jpg]',
    MESSAGE_GROUP_LOCATION: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type: location]',
    MESSAGE_GROUP_CONTACT: '[0987654321000/0123456789000-1234567890@g.us(16-01-2016 00:59)]:[ABCDEF1234567890000]\t [Media Type: vcard]',
    MESSAGE_GROUP_STATE_CHANGED: 'CHATSTATE:\nState: paused\nFrom: 000000000000-1234567890@g.us',
    MESSAGE_PRIVATE_STATE_CHANGED: 'CHATSTATE:\nState: composing\nFrom: 000000000000@s.whatsapp.net',
    MESSAGE_PRIVATE_TEXT: '[0987654321000@s.whatsapp.net(16-01-2016 00:59)]:[ABCDEF1234567890000]\t Hi you! its PM.',
    MESSAGE_CONFIRMATION: 'Message ABCDEF1234567890ABC: Sent delivered receipt and Read\n[connected]:',
    MESSAGE_HEARTBEAT: 'Iq:\nID: 99\nType: result\nfrom: 000000000000@s.whatsapp.net'
};

describe('Valid payload', () => {

    it('Should be a Group Message', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_GROUP_TEXT),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.MESSAGE_GROUP);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });


    it('Should be a Private Message', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_PRIVATE_TEXT),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.MESSAGE_PRIVATE);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });


    it('Should be a Confirmation Message', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_CONFIRMATION),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.CONFIRMATION);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });


    it('Should be a HeartBeat Message', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_HEARTBEAT),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.HEARTBEAT);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });


    it('Should be a StateChanged Message for group', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_GROUP_STATE_CHANGED),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.STATE_CHANGED);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });


    it('Should be a StateChanged Message for private chat', () => {
        let payload = new Payload(MSG_POOL.MESSAGE_PRIVATE_STATE_CHANGED),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.STATE_CHANGED);
        expect(messageType).to.not.equal(TYPES.UNKNOWN);
    });
});


describe('Invalid payloads', () => {
    it('Should be an unsupported message format', () => {
        let payload = new Payload(MSG_POOL.NOT_SUPPORTED_FORMAT),
            messageType = payload.getMessage().getType();

        expect(messageType).to.equal(TYPES.UNKNOWN);
        expect(messageType).to.not.equal(TYPES.HEARTBEAT);
        expect(messageType).to.not.equal(TYPES.CONFIRMATION);
        expect(messageType).to.not.equal(TYPES.MESSAGE_GROUP);
        expect(messageType).to.not.equal(TYPES.MESSAGE_PRIVATE);
    });
});