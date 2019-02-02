process.env.NODE_ENV = 'test';

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../app/dao/user').User;
const mongoose = require('mongoose');

const should = chai.should();

const server = require('../bin/www').server;

const username = faker.internet.userName();
const phone = faker.phone.phoneNumber('###########');
const password = faker.internet.password();


let createdID;
let verification;

chai.use(chaiHttp);

before(done => {
    setTimeout(() => {
        done()
    }, 1000);
});


describe('AUTH', () => {
    describe('POST register', () => {
        it('should POST register', done => {
            const user = {
                username,
                phone,
                password,
                confirmpassword: password,
            };

            chai
                .request(server)
                .post('/auth/register')
                .send(user)
                .end(async (err, res) => {
                    //HERE IS THE CREATED ID
                    res.should.have.status(201);
                    res.body.should.include.keys('token', 'user');

                    createdID = res.body.user._id;
                    const user = await User.findOne({
                        _id: createdID
                    });
                    verification = user.verification;

                    done();

                });
        });

        it('should not POST register if username exists', done => {
            const user = {
                username,
                phone: faker.phone.phoneNumber('###########'),
                password,
                confirmpassword: password,
            };
            chai
                .request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();

                });
        });
    });

    describe('POST verify', done => {
        it('should POST verify', done => {

            const verify = {
                id: createdID,
                verification: verification
            };
            chai
                .request(server)
                .post('/auth/verify')
                .send(verify)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.include.keys('phone', 'verified');
                    done();
                });

        });

        it('should not POST register if phone exists', done => {
            const user = {
                username: faker.internet.userName(),
                phone,
                password,
                confirmpassword: password
            };

            chai
                .request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
        it('should not POST verify if user does not exists', done => {
            const verify = {
                id: mongoose.Types.ObjectId(),
                verification: verification,
            };
            chai
                .request(server)
                .post('/auth/verify')
                .send(verify)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('should not POST verify if verification is invalid', done => {
            const verify = {
                id: createdID,
                verification: verification,
            };
            chai
                .request(server)
                .post('/auth/verify')
                .send(verify)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
    });
    describe('POST forgot pass', () => {
        it('should POST forgot password',  done =>{
            chai
                .request(server)
                .post('/auth/fogot')
                .send({
                    phone
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
