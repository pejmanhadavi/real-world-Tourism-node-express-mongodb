process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {TourLeader} = require('../app/dao/tour_leader');

const loginDetails = {
    email: 'pejmanhadavi77@gmail.com',
    password: 'admin'
};

const server = require('../bin/www').server;

let token;
let createdID;
chai.use(chaiHttp);





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
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
    });
    describe('/POST register', () => {
        it('it should NOT be able to consume the route since no token was sent', done => {
            chai
                .request(server)
                .get('/tourLeader')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('it should POST register', done => {
            chai
                .request(server)
                .post('/tourLeader')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    costPerDay: 5000,
                    costPerHalfDay: 2500
                })
                .end((err, res) => {
                    createdID = res.body.id;
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/PUT tourLeader', () => {
        it('it should UPDATE tourLeader', done => {
            chai
                .request(server)
                .put('/tourLeader')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    costPerDay: 800,
                    costPerHalfDay: 900
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});



after(() => {
    TourLeader.deleteOne(
        {
            _id: createdID
        })
        .then(result => console.log(result))
        .catch(err => console.log(err));
});