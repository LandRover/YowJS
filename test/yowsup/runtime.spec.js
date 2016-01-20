'use strict';

let _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    Runtime = require('./../../src/yowsup/runtime'),
    RESPONSES = require('./../../src/consts/responses'),
    STATES = require('./../../src/consts/states');


chai.should();
chai.use(sinonChai);


describe('YowJS::Runtime', () => {
    let API,
        Payload,
        Spawn,
        runtime,
        Logger,
        Emitter;

    let countryCode = 1,
        phoneNumber = 9876543210000,
        password = 'this.is.a.base64.password=';

    beforeEach(() => {
        API = sinon.spy();
        API.prototype = {};

        Payload = function() {};
        Payload.prototype = {};

        Spawn = function() {
            return {
                stdin: {
                    setEncoding: sinon.spy()
                },

                stdout: {
                    on: sinon.spy()
                },

                on: sinon.spy()
            };
        };

        Logger = {
            log: sinon.spy()
        };

        Emitter = {
            on: sinon.spy(),
            emit: sinon.spy()
        };

        runtime = new Runtime(Logger, Emitter, API, Payload, Spawn);
    });


    it('Should store user credentials on `this`', () => {
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


    it('Should be instanced only once and return API instance', () => {
        let APIInstance = runtime.getAPI(),
            APIInstance2 = runtime.getAPI();

        runtime.API.should.have.been.calledOnce;

        expect(APIInstance).to.be.instanceof(API);
    });


    it('Should be valid credentials format', () => {
        runtime.setCredentials(countryCode, phoneNumber, password);
        let credentials = runtime.getCredentials();

        expect(credentials).to.be.equal(countryCode.toString() + phoneNumber.toString() +':'+ password.toString());
        expect(credentials).to.be.a('string');
    });


    it('Should be able to get CMDArgs as array', () => {
        let cmdArgs = runtime.getCMDWithArgs();

        expect(cmdArgs).to.be.a('array');
    });


    it('Should run the process and bind to STDOUT', () => {
        let run = runtime.run();

        expect(runtime.getCMD().stdin.setEncoding.args[0][0]).to.be.a('string');

        runtime.getCMD().stdin.setEncoding.should.have.been.calledOnce;
        runtime.getCMD().stdout.on.should.have.been.called;
        runtime.getCMD().on.should.have.been.called;

        expect(run).to.equal(runtime); //verify it's chainable
    });

});

describe('YowJS::Runtime::onReceive', () => {
    let runtime;

    beforeEach(() => {
        let API = sinon.spy();
        API.prototype = {
            login: sinon.spy()
        };

        let Payload = function() {};
        Payload.prototype = {
        };

        let Logger = {
            log: sinon.spy()
        };

        let Emitter = {
            on: sinon.spy(),
            emit: sinon.spy()
        };

        runtime = new Runtime(Logger, Emitter, API, Payload);
    });


    it('Should execute NOTHING on CONNECTED message', () => {
        let connected = runtime.onReceive(RESPONSES.CONNECTED);

        expect(connected).to.be.undefined;
        runtime.Emitter.emit.should.not.have.been.called;
    });


    it('Should execute login on OFFLINE message', () => {
        let offline = runtime.onReceive(RESPONSES.OFFLINE);
        runtime.getAPI().login.should.have.been.called;

        let offlineExtended = runtime.onReceive(RESPONSES.OFFLINE_EXTENDED);
        runtime.getAPI().login.should.have.been.called;
    });


    it('Should execute stateChange on AUTH_ERROR message with AUTH_ERROR', () => {
        runtime.onStateChange = sinon.spy();

        let authError = runtime.onReceive(RESPONSES.AUTH_ERROR);

        runtime.onStateChange.should.have.been.called;
        runtime.onStateChange.should.always.have.been.calledWith(STATES.AUTH_ERROR);
    });


    it('Should execute stateChange on AUTH_OK with ONLINE flag', () => {
        runtime.onStateChange = sinon.spy();

        let authError = runtime.onReceive(RESPONSES.AUTH_OK);

        runtime.onStateChange.should.have.been.called;
        runtime.onStateChange.should.always.have.been.calledWith(STATES.ONLINE);
    });



});
