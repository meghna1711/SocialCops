import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiStream from 'chai-stream';
import path from 'path';
import fs from 'fs';
chai.use(chaiHttp);
chai.use(chaiStream);
const should = chai.should();
const {assert} = chai;

describe('/POST login', () => {
    it('it should login successfully with username and password', (done) => {
        let login = {
            username: 'Testuser',
            password: 'password'
        };
        chai.request('http://localhost:3000')
            .post('/login')
            .send(login)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username');
                res.body.should.have.property('token');
                res.body.should.have.property('_id');
                done();
            });
    });

    it('it should throw 500 if no username or password is incorrect', (done) => {
        let login = {
            username: 'Testuser',
            password: 'nopassword'
        };
        chai.request('http://localhost:3000')
            .post('/login')
            .send(login)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                err.response.should.be.a('object');
                err.response.should.have.property('error');
                err.response.text.should.eql('Username and Password did not match !!');
                done();
            });
    });

    it('it should throw 400 if not passing username', (done) => {
        let login = {
            username: '',
            password: 'password'
        };
        chai.request('http://localhost:3000')
            .post('/login')
            .send(login)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                err.response.should.be.a('object');
                err.response.should.have.property('error');
                err.response.text.should.eql('Username is required');
                done();
            });
    });

    it('it should throw 400 if not passing password', (done) => {
        let login = {
            username: 'Testuser',
            password: ''
        };
        chai.request('http://localhost:3000')
            .post('/login')
            .send(login)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                err.response.should.be.a('object');
                err.response.should.have.property('error');
                err.response.text.should.eql('Password is required');
                done();
            });
    });
});

describe('/POST get thumbnail', () => {
    it('it should throw 400 Unauthorized without token', (done) => {
        let thumbnail = {
            url: 'https://static.pexels.com/photos/34950/pexels-photo.jpg'
        };
        chai.request('http://localhost:3000')
            .post('/get/thumbnail')
            .send(thumbnail)
            .end((err, res) => {
                res.should.have.status(400);
                err.response.should.be.a('object');
                err.response.should.have.property('error');
                err.response.text.should.eql('Unauthorized Request');
                done();
            });
    });

    it('it should throw 200 when passed url in body and compared file to be of 50X59', (done) => {
        let thumbnail = {
            url: 'https://static.pexels.com/photos/34950/pexels-photo.jpg'
        };
        chai.request('http://localhost:3000')
            .post('/get/thumbnail?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db')
            .send(thumbnail)
            .end((err, res) => {
                const readFile = fs.readFileSync(path.join(__dirname, "../images/testimage.jpeg"));
                res.should.have.status(200);
                res.should.have.header('content-type', /^image\/(\w+)$/);
                res.body.should.deep.equal(readFile);
                done();
            });
    });

    it('it should throw 400 when no url is passed in body', (done) => {
        let thumbnail = {
            url: ''
        };
        chai.request('http://localhost:3000')
            .post('/get/thumbnail?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db')
            .send(thumbnail)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
});

describe('/POST generate patch', () => {
    it('it should throw 400 Unauthorized without token', (done) => {
        let patch = {
            source: {},
            patch: {}
        };
        chai.request('http://localhost:3000')
            .post('/addpatch')
            .send(patch)
            .end((err, res) => {
                res.should.have.status(400);
                err.response.should.be.a('object');
                err.response.should.have.property('error');
                err.response.text.should.eql('Unauthorized Request');
                done();
            });
    });

    it('it should throw 200 when passed source and patch in body and patched successfully', (done) => {
        let patch = {
            source: {},
            patch: {op: 'add', path: '/foo', value: 'bar'}
        };
        chai.request('http://localhost:3000')
            .post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db')
            .send(patch)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.deep.equal({foo: 'bar'});
                done();
            });
    });

    it('it should throw 400 when patch or nay of its key is missing', (done) => {
        let patch = {
            source: {},
            patch: {op: 'add'}
        };
        chai.request('http://localhost:3000')
            .post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db')
            .send(patch)
            .end((err, res) => {
                res.should.have.status(400);
                err.response.should.have.property('error');
                err.response.text.should.be.a('string');
                done();
            });
    });

    it('it should throw 500 is invalid patch is generated', (done) => {
        let patch = {
            patch: {op: 'add', path: '/foo', value: 'bar'}
        };
        chai.request('http://localhost:3000')
            .post('/addpatch?token=dcf7e3fd321e043161fbd4807c3cab0b8d4913437a02c21a535b02ff625f0ef3510ade0e82cd468cafc3b364279870b75fb76ea78c8f371716ac3718f99b36a53a34e6d4e47cfc808e83bd92bcd4f6db')
            .send(patch)
            .end((err, res) => {
                res.should.have.status(500);
                err.response.should.have.property('error');
                err.response.text.should.be.a('string');
                done();
            });
    });
});
