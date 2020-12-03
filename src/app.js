//nodemon: so that nodemon auto restarts when saving any other file, use src/app.js -e js,hbs

//require the core modules before the npm modules, like path before express, in order to stay organized
const path = require('path'); //core module
const express = require('express'); //npm module
const hbs = require('hbs'); //npm module
// const { argv } = require('process');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express configuration
const publicDirectioryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); //To use a different folder than the required "views" one
const partialsPath = path.join(__dirname, '../templates/partials');

/* Setup for handlebars engine and views location:
    - we have to tell Express which template engine we installed
    - set allows us to set a value to an express setting
    - 'view engine' must be set exactly to the capitalization and spacing as the setting or else it won't work
    - hbs requires us to use a "views" folder in the root folder, as seen to the left
    - we use the 'views' setting name to use a different folder than the required "views" one
    - http://expressjs.com/en/4x/api.html#app.set */
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup for static directory. This will use all .html pages in the public folder to go to different paths
app.use(express.static(publicDirectioryPath));

//Set up the route for handlebars
app.get('', (req, res) => {
    //instead of res.send, we use res.render to render one of our views
    res.render('index.hbs', {
        title: 'Weather App',
        name: 'Evan'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About me',
        name: 'Evan'
    });
});

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        title: 'Help page',
        message: 'example text',
        name: 'Evan'
    });
});


//.get takes in two arguments, the first is the route/partial URL, and a function
app.get('/weather', (req, res) => {
    const locationInput = req.query.address;
    
    if (!locationInput) {
        return res.send({
            error: "You must provide an address."
        });
    }

    //adding = {} creates a default in case the object values are empty/undefined so that geocode does not crash with an error
    geocode(locationInput, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: locationInput
            });
        });
    });
});

//Video 54
app.get('/products', (req, res) => {
    //we can only respond to a request once, so we add "return" to stop the function execution instead of continuing to the next res.send
    if (!req.query.search) {
        return res.send({
            error: "You must provide a serch term."
        });
    }

    console.log(req.query);
    console.log(req.query.search);

    res.send({
        products: []
    });
});

//This is going to match any help page that hasn't been matched so far
app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        message: 'Help article not found.',
        name: 'Evan'
    });
});

//'*' is a wildcard character in Express that we can use to mean, "match anything that we haven't matched so far."
app.get('*',  (req, res) => {
    res.render('404.hbs', {
        title: '404',
        message: 'Page not found.',
        name: 'Evan'
    });
});

app.listen(port, () => {
    console.log("Server is up on port " +port +".");
});