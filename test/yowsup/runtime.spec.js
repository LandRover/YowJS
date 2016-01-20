'use strict';

let chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    Runtime = require('./../../src/yowsup/runtime.js');


chai.should();
chai.use(sinonChai);


describe('YowJS::Runtime', () => {
    let runtime,
        Logger,
        Emitter;

    beforeEach(() => {
        Logger = {
            log: sinon.spy()
        };

        Emitter = {
            on: sinon.spy(),
            emit: sinon.spy()
        };

        runtime = new Runtime(Logger, Emitter);
    });


    it('Should store user credentials on `this`', () => {
        let countryCode = 1,
            phoneNumber = 9876543210000,
            password = 'this.is.a.base64.password=';

        let setCredentials = runtime.setCredentials(countryCode, phoneNumber, password);

        expect(runtime.countryCode).to.equal(countryCode);
        expect(runtime.phoneNumber).to.equal(phoneNumber);
        expect(runtime.password).to.equal(password);

        expect(setCredentials).to.equal(runtime); //verify it's chainable
    });


    it('Should store custom path for yowsup-cli on `this`', () => {
        let yowsupCliPath = '/sbin/yowsup-cli';

        let setCredentials = runtime.setCliPath(yowsupCliPath);

        expect(yowsupCliPath).to.equal(yowsupCliPath);

        expect(setCredentials).to.equal(runtime); //verify it's chainable
    });


});