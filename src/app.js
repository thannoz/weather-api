const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Carloz Maiza'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Carloz Maiza'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'This is the help page feel free to contact me.',
    title: 'Help page',
    name: 'Carloz Maiza'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.json({ error: 'You must provide an address' });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) return res.send({ error });

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) return res.send({ error });

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  console.log(req.query);
  res.send({
    products: []
  });
});

// Not found pages
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 ',
    name: 'Carloz Maiza',
    errorMessage: 'Help article not found.'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404 ',
    name: 'Carloz Maiza',
    errorMessage: 'Page not found.'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
