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
const leaderLogin = {
    email: 'leader@example.com',
    password: 'admin'
};

const leaderId = '5c6e5b4a8266be5fd8dbad7c';

let leaderToken, userToken, requestId;

const request = {
    tourLeader: leaderId,
    experiences: [
        '5c8e342f7bcd6d2b56114945',
        '5c8e343680ee502b6704abfe'
    ]
};

const wrongRequestExperience = {
    tourLeader: leaderId,
    experiences: [
        '5c8e342f7bcd6d2b56114945',
        '5c8e343680ee502b6704abfe',
        '5c8e33466c3165282fbcc2ab'
    ]
};

const wrongRequestLeader = {
    tourLeader: '5c8e342f7bcd6d2b56114945',
    experiences: [
        '5c8e342f7bcd6d2b56114945',
        '5c8e343680ee502b6704abfe'
    ]
};

chai.use(chaiHttp);

before(done => {
    setTimeout(() => {
        done();
    }, 1000);
});


describe('*********** REQUEST ***********', () => {
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
        it('should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(leaderLogin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('token');
                    leaderToken = res.body.data.token;
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

        it('should NOT POST request with wrong experiences', done => {
            chai
                .request(server)
                .post('/request')
                .set('Authorization', `Bearer ${userToken}`)
                .send(wrongRequestExperience)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('should NOT POST request with wrong tourLeader', done => {
            chai
                .request(server)
                .post('/request')
                .set('Authorization', `Bearer ${userToken}`)
                .send(wrongRequestLeader)
                .end((err, res) => {
                    res.should.have.status(404);
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
                    requestId = res.body.data.id;
                    done();
                });
        });
    });
    describe('Get REQUEST Validation', () => {
        it('should NOT Get REQUEST tour leader first validate with wrong TourLeader', done => {
            chai
                .request(server)
                .get('/request/tourLeaderFirstValidate/' + requestId)
                .set('Authorization', `Bearer ${userToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should Get REQUEST tour leader first validate', done => {
            chai
                .request(server)
                .get('/request/tourLeaderFirstValidate/' + requestId)
                .set('Authorization', `Bearer ${leaderToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should Get REQUEST tour leader final validate', done => {
            chai
                .request(server)
                .get('/request/tourLeaderFinalValidate/' + requestId)
                .set('Authorization', `Bearer ${leaderToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should NOT Get REQUEST user final validate with wrong user', done => {
            chai
                .request(server)
                .get('/request/userFinalValidate/' + requestId)
                .set('Authorization', `Bearer ${leaderToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });

            it('should Get REQUEST user final validate', done => {
                chai
                    .request(server)
                    .get('/request/userFinalValidate/' + requestId)
                    .set('Authorization', `Bearer ${userToken}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
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
});