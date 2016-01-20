'use strict';

let chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    YowJS = require('./../src/yowjs.js');

chai.should();
chai.use(sinonChai);


describe('YowJS', () => {
    let yowjs,
        Runtime,
        Logger,
        Emitter;

    beforeEach(() => {
        Runtime = function() {};
        Runtime.prototype = {
            run: sinon.spy(),
            setCredentials: sinon.spy()
        };

        Logger = {
            log: () => {
            }
        };

        Emitter = {
            emit: () => {
            }
        };

        yowjs = new YowJS(Logger, Emitter, Runtime);
    });


    it('Should store constructor data locally', () => {
        expect(yowjs.Logger).to.equal(Logger);
        expect(yowjs.Emitter).to.equal(Emitter);
    });


    it('Should initialize with user credentials', () => {
        let countryCode = 1,
            phoneNumber = 9876543210000,
            password = 'this.is.a.base64.password=';

        let init = yowjs.initialize(countryCode, phoneNumber, password);

        yowjs.Runtime.setCredentials.should.have.been.calledOnce;
        yowjs.Runtime.setCredentials.should.have.been.calledWith(countryCode, phoneNumber, password);

        expect(init).to.equal(yowjs); //verify it's chainable
    });


    it('Should connect to the Runtime daemon', () => {
        let connect = yowjs.connect();

        yowjs.Runtime.run.should.have.been.calledOnce;

        expect(connect).to.equal(yowjs); //verify it's chainable
    });
});