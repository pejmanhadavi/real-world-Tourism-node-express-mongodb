process.env.NODE_ENV = 'test';

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../app/dao/user').User;
const mongoose = require('mongoose');

const should = chai.should();

const server = require('../bin/www').server;


const loginDetails = {
    phone: '09220000000',
    password: 'admin'
};
let token = '';
const createdID = [];

chai.use(chaiHttp);

before(done => {
    setTimeout(() => {
        done()
    }, 10)
});

describe('  *   *   * PROFILE *   *   *', () => {
    describe('POST login', () => {
        it('should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(loginDetails)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
    });

    describe('GET profile', () => {
        it('should NOT GET the profile since no token was sent', done => {
            chai
                .request(server)
                .get('/profile')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should GET profile', done => {
            chai
                .request(server)
                .get('/profile')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.include.keys('username', 'phone');
                    done();
                });
        });
    });

    describe('PUT profile', () => {
        it('should NOT PUT since no token was sent', done => {
            chai
                .request(server)
                .put('/profile')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should NOT PUT since username or password has not been sent', done => {
            chai
                .request(server)
                .put('/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .end((err, res) => {
                    res.should.have.status(422);
                    done();
                })
        });
        it('should PUT if username has been sent', done => {
            chai
                .request(server)
                .put('/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'pejman'
                })
                .end((err, res) => {
                   res.should.have.status(200);
                   done();
                });
        });
        it('should PUT if password has been sent', done => {
            chai
                .request(server)
                .put('/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'admin',
                    newPassword: '12345',
                    confirmNewPassword: '12345'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('should PUT if username and password has been sent', done => {
            chai
                .request(server)
                .put('/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'admin',
                    currentPassword: '12345',
                    newPassword: 'admin',
                    confirmNewPassword: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

after(() => {
    createdID.map(item => {
        return User.deleteOne(
            {
                _id: item
            },
            error => {
                if (error !== null) {
                    console.log(error)
                }
            }
        );
    });
});