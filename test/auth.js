process.env.NODE_ENV = 'test';

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {User} = require('../app/dao/user');
const {ForgotPassword} = require('../app/dao/forgot_password');
const mongoose = require('mongoose');
const uuid = require('uuid');
const should = chai.should();


const loginDetails = {
	email: 'pejmanhadavi77@gmail.com',
	password: 'admin'
};

const server = require('../bin/www').server;

const name = faker.random.words();
const email = 'pejmanhadaviph@yahoo.com';
const password = faker.internet.password();


let createdID;
let verification;
let verificationForgot;

chai.use(chaiHttp);

before(done => {
	setTimeout(() => {
		done();
	}, 1000);
});


describe('*********** AUTH ***********', () => {
	describe('/POST login', () => {
		it('it should GET token', done => {
			chai
				.request(server)
				.post('/auth/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('token');
					done();
				});
		});
	});


	describe('/POST register', () => {
		it('it should POST register', done => {
			const user = {
				name: faker.random.words(),
				email,
				password: faker.random.words()
			};
			chai
				.request(server)
				.post('/auth/register')
				.send(user)
				.end(async (err, res) => {
					res.should.have.status(201);
					res.body.should.include.keys('token', 'user');

					createdID = res.body.user._id;
					const user = User.findById(createdID, (err, result) => {
						verification = result.verification;
					});
					done();
				});
		});

		it('it should NOT POST a register if email already exists', done => {
			const user = {
				name: faker.random.words(),
				email,
				password: faker.random.words()
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

	describe('/GET verify', () => {
		it('it should GET verify', done => {
			console.log('VERIFICATION: '+verification);
			chai
				.request(server)
				.get('/auth/verify/'+verification)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.include.keys('email', 'verified');
					res.body.verified.should.equal(true);
					done();
				});
		});

		it('it should NOT GET verify with wrong uuid', done => {
			chai
				.request(server)
				.get('/auth/verify/'+uuid.v4())
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					done();
				});
		});
		it('it should NOT GET verify with wrong VERIFICATION', done => {
			chai
				.request(server)
				.get('/auth/verify/'+faker.random.words())
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					done();
				});
		});
	});

	describe('/POST forgotPassword', () => {
		it('it should POST forgotPassword', done => {
			chai
				.request(server)
				.post('/auth/forgot')
				.send({
					email
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.include.keys('msg');
					ForgotPassword.findOne({
						email,
						used: false
					}, (err, result) => {
						verificationForgot = result.verification;
					});
					done();
				});
		});
		it('it should NOT POST forgotPassword with wrong EMAIL', done => {
			chai
				.request(server)
				.post('/auth/forgot')
				.send({
					email: faker.internet.email()
				})
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					done();
				});
		});
	});

	describe('/POST resetPassword', () => {
		it('it should POST resetPassword', done => {
			chai
				.request(server)
				.post('/auth/reset/'+verificationForgot)
				.send({
					password: 'admin'
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.include.keys('msg');
					res.body.msg.should.equal('PASSWORD_CHANGED');
					done();
				});
		});

		it('it should NOT POST resetPassword with wrong uuid', done => {
			chai
				.request(server)
				.post('/auth/reset/'+uuid.v4())
				.send({
					password: '12345'
				})
				.end((err, res) => {
					res.should.have.status(404);
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