process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {TourLeader} = require('../app/dao/tour_leader');

const loginDetails = {
    email: 'leader@example.com',
    password: 'admin'
};

const server = require('../bin/www').server;

let token;
let createdID;
chai.use(chaiHttp);

const experiences = {
    experiences: [
        '5c8e342f7bcd6d2b56114945',
        '5c8e33466c3165282fbcc2ab'
    ]
};

const wrongExperiences = {
    experiences: [
        '5c8e33466c3165282fbcc2af'
    ]
};



before(done => {
    setTimeout(() => {
        done();
    }, 1000);
});




describe('*********** TOUR_LEADER ***********', () => {
    describe('/POST login', () => {
        it('it should GET token', done => {
            chai
                .request(server)
                .post('/auth/login')
                .send(loginDetails)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.have.property('token');
                    token = res.body.data.token;
                    done();
                });
        });
    });

    describe('/PUT tourLeader', () => {
        it('it should NOT UPDATE tourLeader with wrong experience', done => {
            chai
                .request(server)
                .put('/tourLeader')
                .set('Authorization', `Bearer ${token}`)
                .send(wrongExperiences)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should NOT UPDATE tourLeader', done => {
            chai
                .request(server)
                .put('/tourLeader')
                .set('Authorization', `Bearer ${token}`)
                .send(experiences)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});