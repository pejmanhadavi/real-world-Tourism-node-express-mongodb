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


describe('  *   *   * AUTH *  *   *', () => {
    describe('POST register', () => {
        it('should POST register', done => {
            const user = {
                username,
                phone,
                password,
                confirmPassword: password,
            };

            chai
                .request(server)
                .post('/auth/register')
                .send(user)
                .end(async (err, res) => {
                    res.should.have.status(201);
                    res.body.should.include.keys('username', 'phone');
                    createdID = res.body._id;
                    const user = await User.findOne({
                        _id: createdID
                    });
                    verification = user.verification;
                    done();

                });
        });

        it('should not POST if verification has been sent',  done => {
            const user = {
                username,
                phone,
                password,
                confirmPassword: password,
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


        it('should not POST register if username exists', done => {
            const user = {
                username,
                phone: faker.phone.phoneNumber('###########'),
                password,
                confirmPassword: password,
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
                    res.body.should.include.keys('token','user');
                    done();
                });

        });

        it('should not POST register if phone exists', done => {
            const user = {
                username: faker.internet.userName(),
                phone,
                password,
                confirmPassword: password
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
                .post('/auth/forgot')
                .send({
                    phone
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        it('should not POST if phone does not exists', done => {
            chai
                .request(server)
                .post('/auth/forgot')
                .send({
                    phone: faker.phone.phoneNumber('###########')
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    
    describe('POST login', () => {
        it('should POST login', done => {
            const user = {
                phone,
                password
            };

            chai
                .request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    done();
                });
        });

        it('should not POST login if password is incorrect', done => {
            const user = {
                phone,
                password : faker.internet.password()
            };
            chai
                .request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('should not POST login if phone does not exists', done => {
            const user = {
                phone: faker.phone.phoneNumber('###########'),
                password,
            };
            chai
                .request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });
    });
});


after(() => {
    User.deleteOne(
        {
            _id: createdID
        })
        .then(result => console.log(result))
        .catch(err => console.log(err));
});