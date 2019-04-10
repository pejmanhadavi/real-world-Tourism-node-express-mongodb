process.env.NODE_ENV = 'test';

const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {User} = require('../app/dao/user');
const {ForgotPassword} = require('../app/dao/forgot_password');
const uuid = require('uuid');
const should = chai.should();


const loginDetails = {
	phone: '09091234567',
	password: 'admin'
};

const wrongLoginDetails = {
	phone: '09091234567',
	password: 'wrongPass'
};

const registerDetails = {
	name: faker.random.words(),
	phone : '09121234567',
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
				.send(registerDetails)
				.end(async (err, res) => {
					res.should.have.status(201);
					createdID = res.body.data._id;
					User.findById(createdID, (err, result) => {
						verification = result.phoneVerification;
					});
					done();
				});
		});

		// it('it should NOT POST a register if phone already exists', done => {
		// 	chai
		// 		.request(server)
		// 		.post('/auth/register')
		// 		.send(registerDetails)
		// 		.end((err, res) => {
		// 			res.should.have.status(409);
		// 			done();
		// 		});
		// });
		it('it should NOT POST a register if phone is not valid', done => {
			const user = {
				name: faker.random.words(),
				phone: 'this is not an email',
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

	describe('/POST verify', () => {

		it('it should NOT POST verify with wrong verification', done => {
			chai
				.request(server)
				.post('/auth/verify')
				.send({
					phone: registerDetails.phone,
					phoneVerification: '4444444444444'
				})
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});

		it('it should POST verify', done => {
			chai
				.request(server)
				.post('/auth/verify')
				.send({
					phone: registerDetails.phone,
					phoneVerification: verification
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.user.phoneVerified.should.equal(true);
					done();
				});
		});
	});

	describe('/POST forgotPassword', () => {
		it('it should POST forgotPassword', done => {
			const phone = registerDetails.phone;
			chai
				.request(server)
				.post('/auth/forgot')
				.send({
					phone
				})
				.end((err, res) => {
					res.should.have.status(200);
					ForgotPassword.findOne({
						phone,
						used: false
					}, (err, result) => {
						verificationForgot = result.verification;
					});
					done();
				});
		});
		it('it should NOT POST forgotPassword with wrong PHONE', done => {
			chai
				.request(server)
				.post('/auth/forgot')
				.send({
					phone: faker.phone.phoneNumber('###########')
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
