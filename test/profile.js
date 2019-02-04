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
        it('should NOT be able to consume the route since no token was sent', done => {
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