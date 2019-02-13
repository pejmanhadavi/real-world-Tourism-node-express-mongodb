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
let token;

chai.use(chaiHttp);



describe('*********** PROFILE ***********', () => {
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
	describe('/GET profile', () => {
		it('it should NOT be able to consume the route since no token was sent', done => {
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
					res.body.should.include.keys('name', 'email');
					done();
				});
		});
	});

	describe('/PUT profile', () => {
		it('it should UPDATE profile', done => {
			const user = {
				name: 'Test123456',
			};
			chai
				.request(server)
				.put('/profile')
				.set('Authorization', `Bearer ${token}`)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					done();
				});
		});
	});
});