const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const multer = require('multer');
const Sequelize = require('sequelize');

const { database, user, password } = require('./database/connection');
const SESSION_SECRET = require('./database/session-secret');

const User = require('./models/user');
const Character = require('./models/character');
const Abilities = require('./models/abilities');

const sequelizeDB = new Sequelize(database, user, password, {
  host: 'localhost',
  dialect: 'postgres'
});

const sequelizeSessionStore = new SessionStore({
  db: sequelizeDB
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false
  })
);

User.hasMany(Character);

Character.hasOne(Abilities);

sequelizeDB
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');

    app.listen(3000);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
