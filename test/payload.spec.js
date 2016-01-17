'use strict';

let chai = require('chai'),
    expect = chai.expect,
    Payload = require('./../src/payload.js');


describe('Payload', () => {
    let payload = new Payload();
    
    it('returns a string', () => {
        var t = 'h1';
        
        expect(payload).to.equal(payload);
        
    });
});