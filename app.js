const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

//template engine settings
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
app.use(expressLayouts)
app.use(express.static('public'))
app.use("/uploads", express.static(path.join(__dirname,'/src/uploads')));
app.set('view engine', 'ejs')
app.set('views',)
app.set('views', path.resolve(__dirname, './src/views'))

//db connection
require('./src/config/database')
const MongoDBStore = require('connect-mongodb-session')(session);

//session and flash message
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: 'sessions'
});

app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave : false,
        saveUninitialized : true,
        cookie: {
            maxAge:1000 * 60 * 60 * 24 
        },
        store:sessionStore
    }
))

app.use(flash())
app.use((req, res, next) => {
    res.locals.validation_error = req.flash('validation_error')
    res.locals.success_message = req.flash('success_message')
    res.locals.email = req.flash('email')
    res.locals.firstName = req.flash('firstName')
    res.locals.lastName = req.flash('lastName')
    res.locals.password = req.flash('password')
    res.locals.rePassword = req.flash('rePassword')
    res.locals.createdAt = req.flash('createdAt')
    res.locals.movieName = req.flash('movieName')
    res.locals.directorName = req.flash('directorName')
    res.locals.kind = req.flash('kind')
    res.locals.bookName = req.flash('bookName')
    res.locals.writerName = req.flash('writerName')
    res.locals.genre = req.flash('genre')
    res.locals.dayName = req.flash('dayName')
    res.locals.importance = req.flash('importance')
    res.locals.date = req.flash('date')
    res.locals.personName = req.flash('personName')
    res.locals.phone = req.flash('phone')
    res.locals.other = req.flash('other')
    res.locals.anythingName = req.flash('anythingName')
    res.locals.anything = req.flash('anything')
    res.locals.date = req.flash('date')

    res.locals.login_error = req.flash('error')

    next()
})

app.use(passport.initialize())
app.use(passport.session())

//routers include
const authRouter = require('./src/routers/auth_router')
const administrationRouter = require('./src/routers/administration_router')

//to read form information (middleware)
app.use(express.urlencoded({ extended: true}))


//index rota
app.get('/', (req, res) => {
   res.json({ mesaj : 'merhaba'})
})


app.use('/', authRouter)
app.use('/administration', administrationRouter)


//port
app.listen(process.env.PORT, () => {
    console.log(`The server is up. Port: ${process.env.PORT}`);
})