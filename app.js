const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const multer = require('multer');

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

const generateMD5 = require('./utils/generateMD5');

const User = require('./models/user');
const Character = require('./models/character');
const Abilities = require('./models/abilities');
const Equipment = require('./models/equipment');
const Traits = require('./models/traits');

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/character');
const abilitiesRoutes = require('./routes/abilities');
const equipmentRoutes = require('./routes/equipment');
const traitsRoutes = require('./routes/traits');

const sequelizeDB = require('./database/connection');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept, _csurf, xsrf-token'
  );

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

app.disable('x-powered-by');
app.disable('X-Powered-By');

app.use(cookieParser());

app.use(csrfProtection, (req, res, next) => {
  res.cookie('XSRF_TOKEN', req.csrfToken(), { httpOnly: false, path: '/' });
  next();
});

app.use(
  '/api',
  authRoutes,
  characterRoutes,
  abilitiesRoutes,
  traitsRoutes,
  equipmentRoutes
);

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
