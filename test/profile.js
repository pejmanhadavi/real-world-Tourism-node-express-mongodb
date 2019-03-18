process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const loginDetails = {
	email: 'admin@admin.com',
	password: 'admin'
};

const editPassDetails = {
	currentPassword: 'admin',
	newPassword: 'admin'
};

const server = require('../bin/www').server;

let token;

chai.use(chaiHttp);

before(done => {
	setTimeout(() => {
		done();
	}, 1000);
});


describe('*********** PROFILE ***********', () => {
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
					res.body.data.should.include.keys('name', 'email');
					done();
				});
		});
	});

	describe('/PUT profile', () => {
		it('it should NOT UPDATE profile since no token was sent', done => {
			const user = {
				name: 'Test123456',
			};
			chai
				.request(server)
				.put('/profile')
				.send(user)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					done();
				});
		});

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

	describe('/PUT password', () => {
		it('should NOT UPDATE password since not token was sent', done =>{
			chai
				.request(server)
				.put('/profile/password')
				.send(editPassDetails)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
		it('should NOT UPDATE password when current password is incurrect', done => {
			chai
				.request(server)
				.put('/profile/password')
				.set('Authorization', `Bearer ${token}`)
				.send({
					currentPassword: 'wrongPass',
					newPassword: 'new for wrongPass'
				})
				.end((err, res) => {
					res.should.have.status(409);
					done();
				});
		});
		it('should UPDATE password', done => {
			chai
				.request(server)
				.put('/profile/password')
				.set('Authorization', `Bearer ${token}`)
				.send(editPassDetails)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});