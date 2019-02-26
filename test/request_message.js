process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {Request} = require('../app/dao/request');
const {Message} = require('../app/dao/message');

const tourLeader = {
    email: 'tourLeader@gmail.com',
    password: 'admin'
};

const user = {
    email: 'user@gmail.com',
    password: 'admin'
};



const server = require('../bin/www').server;

let userToken;
let tourLeaderToken;
let requestId;
let messageId;

const request = {
    tourLeader: "5c6e5b4a8266be5fd8dbad7c",
    maxDayOccupancy: 2,
    maxHalfDayOccupancy: 0
};

chai.use(chaiHttp);


before(done => {
    setTimeout(() => {
        done();
    }, 1000);
});


describe('*********** REQUEST ***********', () => {
    describe('POST login', () => {
        it('should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    userToken = res.body.token;
                    done();
                });
        });
        it('should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(tourLeader)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    tourLeaderToken = res.body.token;
                    done();
                });
        });
    });

    describe('POST REQUEST', () => {
        it('should NOT be able to consume the route since no token was sent', done => {
            chai
                .request(server)
                .post('/request')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should POST request', done => {
            chai
                .request(server)
                .post('/request')
                .set('Authorization', `Bearer ${userToken}`)
                .send(request)
                .end((err, res) => {
                   res.should.have.status(200);
                   requestId = res.body.id;
                   done();
                });
        });
    });
    describe('GET request', () => {
        it('should GET tourLeaderFirstValidate', done => {
            chai
                .request(server)
                .get('/request/tourLeaderFirstValidate/'+requestId)
                .set('Authorization', `Bearer ${tourLeaderToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should GET tourLeaderFinalValidate', done => {
            chai
                .request(server)
                .get('/request/tourLeaderFinalValidate/'+requestId)
                .set('Authorization', `Bearer ${tourLeaderToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('should GET userFinalValidate', done => {
            chai
                .request(server)
                .get('/request/userFinalValidate/'+requestId)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should POST userSatisfaction', done => {
            chai
                .request(server)
                .post('/request/userSatisfaction/'+requestId)
                .send({
                    satisfaction: true
                })
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should POST tourLeaderSatisfaction', done => {
            chai
                .request(server)
                .post('/request/tourLeaderSatisfaction/'+requestId)
                .send({
                    satisfaction: true
                })
                .set('Authorization', `Bearer ${tourLeaderToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


describe('*********** MESSAGE ***********', () => {
    describe('POST message', () => {
        it('should POST request', done => {
            chai
                .request(server)
                .post('/message/'+requestId)
                .send({
                    body: 'test message *******'
                })
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    messageId = res.body.id;
                   done();
                });

        });
    });

    describe('PUT message', () => {
        it('should PUT read message', done => {
            chai
                .request(server)
                .put('/message/'+messageId)
                .set('Authorization', `Bearer ${tourLeaderToken}`)
                .end((err, res) => {
                   res.should.have.status(200);
                   done()
                });
        });
    });
});

after(() => {
    Request.deleteOne(
        {
            _id: requestId
        })
        .then(result => console.log(result))
        .catch(err => console.log(err));

    Message.deleteOne({
        _id: messageId
    })
        .then(result => console.log(result))
        .catch(err => console.log(err));
});