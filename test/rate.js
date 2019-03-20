process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../bin/www').server;
const {Request} = require('../app/dao/request');

const userLogin = {
    email: 'user@example.com',
    password: 'admin'
};

const requestId = '5c925bf416c0ba38ba3e9a5a';
const leaderId = '5c6e5b4a8266be5fd8dbad7c';

const data = {
  tourLeaderId: leaderId,
  requestId: requestId,
  star: 4,
  comment: 'this is some comment'
};

let userToken;

chai.use(chaiHttp);

before(done => {
    setTimeout(() => {
        done();
    }, 1000);
});


describe('*********** RATE ***********', () => {
    describe('/POST login', () => {
        it('should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(userLogin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('token');
                    userToken = res.body.data.token;
                    done();
                });
        });
    });

    describe('/POST rate', () => {
        it('should NOT POST Rate since no token had been set', done => {
            chai
                .request(server)
                .post('/rate')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                   done();
                });
        });

        it('should POST Rate', done => {
            chai
                .request(server)
                .post('/rate')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data)
                .end((err, res) => {
                    console.log(res.body.message);
                   res.should.have.status(201);
                   done();
                });
        });
    });
});