const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const multer = require('multer');

const csrfProtection = csrf({ cookie: true });

const SESSION_SECRET = require('./database/session-secret');

const generateMD5 = require('./utils/generateMD5');

const User = require('./models/user');
const Character = require('./models/character');
const Abilities = require('./models/abilities');
const Equipment = require('./models/equipment');
const Traits = require('./models/traits');

const characterRoutes = require('./routes/character');
const abilitiesRoutes = require('./routes/abilities');
const equipmentRoutes = require('./routes/equipment');
const traitsRoutes = require('./routes/traits');

const sequelizeDB = require('./database/connection');

const sequelizeSessionStore = new SessionStore({
  db: sequelizeDB,
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.disable('x-powered-by');

app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
// app.use(csrfProtection);

app.use(
  '/build',
  characterRoutes,
  abilitiesRoutes,
  traitsRoutes,
  equipmentRoutes
);

// app.all('*', (req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
// });

/** MODEL RELATIONSHIPS  **/

User.hasMany(Character);

Character.hasOne(Abilities);
Character.hasOne(Equipment);
Character.hasOne(Traits);

/**************************/

sequelizeDB
  //.sync({ force: true })
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');

    app.listen(5050);
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
