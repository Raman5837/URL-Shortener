const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressEjsLayout = require('express-ejs-layouts')
const port = 5000;

const connect = require('./config/dbConnect');

const URLS = require('./models/urls')


// connecting to database
connect();

// views engine
app.set('view engine', 'ejs')
app.use(expressEjsLayout)
app.use(express.static('public'))

// Parsing the data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// API
app.get('/', (req, res) => {
    // res.json({ 'msg': 'Hi !' })
    res.render('index', { host: req.get('host') })
})

// post request to server
app.post('/', async (req, res) => {
    console.log(`form data :`, req.body)
    const { redirectedUrl, name } = req.body

    if (redirectedUrl === '' || name === '') {
        return res.render('index', { host: req.get('host'), error: 'Please Fill All Fields' })
    }

    const url = await URLS.find({ name: name });

    // console.log(url);

    if (url.length == 1) {
        return res.render('index', { host: req.get('host'), error: 'This Url Name Is Already Present' })
    }

    const fullUrl = 'http://' + req.get('host') + '/' + name;
    // return console.log(fullUrl);

    const newUrl = new URLS({
        redirectedUrl,
        name,
        fullUrl,
    })
    newUrl.save()
        .then((response) => res.render('index', { host: req.get('host'), success: fullUrl }))
        .catch(err => console.log(err))
})

// get Request From The server
app.get('/:name', async (req, res) => {
    const { name } = req.params

    const data = await URLS.find({ name: name })

    if (data.length < 1) {
        return res
            .status(404)
            .json({ err: true, msg: 'Error 404: This Url is not found' })
    }

    res.redirect(data[0].redirectedUrl)
    console.log(data[0].redirectedUrl);

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})