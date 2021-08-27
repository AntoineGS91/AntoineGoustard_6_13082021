// Import express
const express = require('express');

// Import bodyParser
const bodyParser = require('body-parser');

// Import mongoose + Fix DepreciationWarning (node)
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);


const path = require('path');

const app = express();

// ROUTES
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connexion MongoDB
mongoose.connect('mongodb+srv://test:test@cluster0.3ztmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Autorisation échanges
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Serveur
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//EXPORTS
module.exports = app;