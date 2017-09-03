'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _chaiStream = require('chai-stream');

var _chaiStream2 = _interopRequireDefault(_chaiStream);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
_chai2.default.use(_chaiStream2.default);
var should = _chai2.default.should();
var assert = _chai2.default.assert;


describe('/POST login', function () {
    it('it should login successfully with username and password', function (done) {
        var login = {
            username: 'Testuser',
            password: 'password'
        };
        _chai2.default.request('http://localhost:3000').post('/login').send(login).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('username');
            res.body.should.have.property('token');
            res.body.should.have.property('_id');
            done();
        });
    });

    it('it should throw 500 if no username or password is incorrect', function (done) {
        var login = {
            username: 'Testuser',
            password: 'nopassword'
        };
        _chai2.default.request('http://localhost:3000').post('/login').send(login).end(function (err, res) {
            res.should.have.status(500);
            res.body.should.be.a('object');
            err.response.should.be.a('object');
            err.response.should.have.property('error');
            err.response.text.should.eql('Username and Password did not match !!');
            done();
        });
    });

    it('it should throw 400 if not passing username', function (done) {
        var login = {
            username: '',
            password: 'password'
        };
        _chai2.default.request('http://localhost:3000').post('/login').send(login).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            err.response.should.be.a('object');
            err.response.should.have.property('error');
            err.response.text.should.eql('Username is required');
            done();
        });
    });

    it('it should throw 400 if not passing password', function (done) {
        var login = {
            username: 'Testuser',
            password: ''
        };
        _chai2.default.request('http://localhost:3000').post('/login').send(login).end(function (err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object');
            err.response.should.be.a('object');
            err.response.should.have.property('error');
            err.response.text.should.eql('Password is required');
            done();
        });
    });
});

describe('/POST get thumbnail', function () {
    it('it should throw 400 Unauthorized without token', function (done) {
        var thumbnail = {
            url: 'https://static.pexels.com/photos/34950/pexels-photo.jpg'
        };
        _chai2.default.request('http://localhost:3000').post('/get/thumbnail').send(thumbnail).end(function (err, res) {
            res.should.have.status(400);
            err.response.should.be.a('object');
            err.response.should.have.property('error');
            err.response.text.should.eql('Unauthorized Request');
            done();
        });
    });

    it('it should throw 200 when passed url in body and compared file to be of 50X59', function (done) {
        var thumbnail = {
            url: 'https://static.pexels.com/photos/34950/pexels-photo.jpg'
        };
        _chai2.default.request('http://localhost:3000').post('/get/thumbnail?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db').send(thumbnail).end(function (err, res) {
            var readFile = _fs2.default.readFileSync(_path2.default.join(__dirname, "../images/testimage.jpeg"));
            res.should.have.status(200);
            res.should.have.header('content-type', /^image\/(\w+)$/);
            res.body.should.deep.equal(readFile);
            done();
        });
    });

    it('it should throw 400 when no url is passed in body', function (done) {
        var thumbnail = {
            url: ''
        };
        _chai2.default.request('http://localhost:3000').post('/get/thumbnail?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db').send(thumbnail).end(function (err, res) {
            res.should.have.status(400);
            done();
        });
    });
});

describe('/POST generate patch', function () {
    it('it should throw 400 Unauthorized without token', function (done) {
        var patch = {
            source: {},
            patch: {}
        };
        _chai2.default.request('http://localhost:3000').post('/addpatch').send(patch).end(function (err, res) {
            res.should.have.status(400);
            err.response.should.be.a('object');
            err.response.should.have.property('error');
            err.response.text.should.eql('Unauthorized Request');
            done();
        });
    });

    it('it should throw 200 when passed source and patch in body and patched successfully', function (done) {
        var patch = {
            source: {},
            patch: { op: 'add', path: '/foo', value: 'bar' }
        };
        _chai2.default.request('http://localhost:3000').post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db').send(patch).end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.deep.equal({ foo: 'bar' });
            done();
        });
    });

    it('it should throw 400 when patch or nay of its key is missing', function (done) {
        var patch = {
            source: {},
            patch: { op: 'add' }
        };
        _chai2.default.request('http://localhost:3000').post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db').send(patch).end(function (err, res) {
            res.should.have.status(400);
            err.response.should.have.property('error');
            err.response.text.should.be.a('string');
            done();
        });
    });

    it('it should throw 500 is invalid patch is generated', function (done) {
        var patch = {
            patch: { op: 'add', path: '/foo', value: 'bar' }
        };
        _chai2.default.request('http://localhost:3000').post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db').send(patch).end(function (err, res) {
            res.should.have.status(500);
            err.response.should.have.property('error');
            err.response.text.should.be.a('string');
            done();
        });
    });
});