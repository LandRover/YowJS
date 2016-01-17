'use strict';

let chai = require('chai'),
    expect = chai.expect,
    Payload = require('./../src/payload.js'),
    MessagePrivate = require('./../src/payloads/message_private'),
    MessageGroup = require('./../src/payloads/message_group');

describe('Payload', () => {


    it('returns a string', () => {
        let payload = new Payload('[0000000000000/0000000000000-1234567890@g.us(01-01-2016 01:01)]:[ABCDEF1234567890000]\t Hi there');

        var t = payload.get();

        expect(payload).to.equal(payload);

    });
});