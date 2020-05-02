const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');

const authController = require('../../controllers/auth');
const User = require('../../models/user');

describe('authController', () => {
  describe('signup', () => {
    before(() => {
      sinon.stub(User, 'create');
    });
    after(() => {
      User.create.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const req = {
        body: {
          email: 'john&test1.com',
          password: 'pnQ234lKfg',
          name: 'John',
        },
      };

      User.create.throws();

      await authController
        .signup(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should create a new user and return a 201 statusCode in the response along with confirmation message', async () => {
      const req = {
        body: {
          email: 'john&test1.com',
          password: 'pnQ234lKfg',
          name: 'John',
        },
      };

      const res = {
        message: '',
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
        },
      };

      User.create.returns({ id: '1' });

      await authController
        .signup(req, res, () => {})
        .then(() => {
          expect(res.statusCode).to.eql(201);
          expect(res.message).to.eql('User created');
        });
    });
  });

  describe('login', () => {
    before(() => {
      sinon.stub(User, 'findAll');
    });
    after(() => {
      User.findAll.restore();
    });

    it('should throw an error 500 code when accessing the database fails', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' },
      };

      User.findAll.throws();

      await authController
        .login(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 500);
        });
    });

    it('should throw an error 401 when a user is not found', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' },
      };

      User.findAll.returns(null);

      await authController
        .login(req, {}, () => {})
        .then((result) => {
          expect(result).to.be.an('error');
          expect(result).to.have.property('statusCode', 401);
        });
    });

    it('should authenticate a user and return a response status of 200', async () => {
      const req = {
        body: { email: 'john&test1.com', password: 'pnQ234lKfg' },
      };
      const userId = '1';
      const hashedPassword = await bcrypt.hash('pnQ234lKfg', 12);

      const res = {
        message: null,
        userId: null,
        token: null,
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;

          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.userId = data.userId;
          this.token = data.token;
        },
      };

      User.findAll.returns({
        id: userId,
        email: 'john&test1.com',
        password: hashedPassword,
      });

      await authController
        .login(req, res, () => {})
        .then(() => {
          expect(res).to.have.property('statusCode', 200);

          expect(res.message).to.equal('User authenticated');
          expect(res.userId).to.equal(userId);
          expect(res.token).to.exist;
        });
    });
  });
});
