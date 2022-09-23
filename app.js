const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');

const User = require('./models/user');
const { timeStamp, time } = require('console');

const app = express();

mongoose.connect('mongodb://localhost:27017/enseval-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
})

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));

const sessionConfig = {
    name: 'session', 
    secret: 'sessionuser', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.get('/', (req, res) => {
    res.render("loginpage");
});

app.get('/loginpage', (req, res) => {
    res.render("loginpage");
});

app.post('/mainpage', async (req, res) => {
    const newUser = new User(req.body);
    console.log(req.body);
    await newUser.save();
    res.render('mainpage', {newUser});
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

