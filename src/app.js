const express = require('express');

// const artistRouter = require('./routes/artist');
// const albumRouter = require('./routes/album');

const artistControllers = require('./controllers/artist');
const albumControllers = require('./controllers/album');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.updateArtist);

app.delete('/artists/:id', artistControllers.delete);

app.post('/artists/:id/albums', albumControllers.createAlbum);

app.post('/artists/:id/albums', albumControllers.getAlbumsByArtistId);

module.exports = app;
