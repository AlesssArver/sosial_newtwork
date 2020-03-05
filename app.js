const path = require('path')
const routesIndex = require('./routes/index')
const routesAuth = require('./routes/auth')
const routesUser = require('./routes/user')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const passport = require('passport')
require('./config/passport')(passport)
const cookieSession = require('cookie-session')
const flash = require('connect-flash')

const app = express();

  const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, keys: ['key1'] }))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(routesIndex)
app.use(routesAuth)
app.use(routesUser)

const port = 4000

const start = async () => {
  try {
      await mongoose.connect(
          'mongodb+srv://<Your Name>:<Your Password>@<Your cluster>-donfo.mongodb.net/<Your collection>',
          {
              useNewUrlParser: true,
              useUnifiedTopology: true
          }).then(() => console.log('connected to mongodb'))
      app.listen(port, () => console.log(`Server started on port: ${port}`))
  } catch (e) {
      console.log(e)
  }
}
start()