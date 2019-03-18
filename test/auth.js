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
	email: 'admin@admin.com',
	password: 'admin'
};

const wrongLoginDetails = {
	email: 'admin@admin.com',
	password: 'wrongPass'
};

const registerDetalis = {
	name: faker.random.words(),
	email : 'pejmanhadaviph@yahoo.com',
	password : faker.internet.password()
};
const server = require('../bin/www').server;


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

		it('it should NOT GET token when password is wrong', done => {
			chai
				.request(server)
				.post('/auth/login')
				.send(wrongLoginDetails)
				.end((err, res) => {
					res.should.have.status(409);
					done();
				});
		});

		it('it should GET token', done => {
			chai
				.request(server)
				.post('/auth/login')
				.send(loginDetails)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.have.property('token');
					res.body.data.should.have.property('refreshToken');
					res.body.data.should.have.property('user');
					done();
				});
		});
	});


	describe('/POST register', () => {
		it('it should POST register', done => {
			chai
				.request(server)
				.post('/auth/register')
				.send(registerDetalis)
				.end(async (err, res) => {
					res.should.have.status(201);
					createdID = res.body.data.user._id;
					User.findById(createdID, (err, result) => {
						verification = result.verification;
					});
					done();
				});
		});

		it('it should NOT POST a register if email already exists', done => {
			chai
				.request(server)
				.post('/auth/register')
				.send(registerDetalis)
				.end((err, res) => {
					res.should.have.status(409);
					done();
				});
		});
		it('it should NOT POST a register if email is not valid', done => {
			const user = {
				name: faker.random.words(),
				email: 'this is not an email',
				password: faker.random.words()
			};
			chai
				.request(server)
				.post('/auth/register')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
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