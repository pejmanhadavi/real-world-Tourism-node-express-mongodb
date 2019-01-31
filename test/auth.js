process.env.NODE_ENV = 'test';

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const server = require('../bin/www').server;

const username = 'test_username';
const phone = '09220000000';
const password = 'test_password'
let createdID = '';
let verification = '';
let verificationForgot = '';

chai.use(chaiHttp);

before(done => {
    setTimeout(() => {
        done()
    }, 10);
});


describe('AUTH', () => {
    describe('POST register', () => {
        it('should post register', () =>  {
            const user = {
                username,
                phone,
                password,
                confirmpassword: password
            };

            chai
                .request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.include.keys('token', 'username');
                    createdID = res.body.user._id;
                    verification = res.body.user.verification;


                    console.log('ID: '+createdID);
                    console.log('verification: '+verification);


                    done();

                });
        });
    });

    describe('POST verify', () =>{
        it('should post verify', () => {
            // console.log('ID: '+createdID);
            // console.log('verification: '+verification);
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
                    res.body.should.include.keys('verified');
                    done();

                });

        });
    });

});