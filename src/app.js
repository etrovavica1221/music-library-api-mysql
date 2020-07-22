const express = require('express');

// const artistRouter = require('./routes/artist');
// const albumRouter = require('./routes/album');

const artistControllers = require('./controllers/artist');
const albumControllers = require('./controllers/album');
const songsControllers = require('./controllers/song');
const { request } = require('express');

const app = express();

app.use(express.json());

// artist

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.updateArtist);

app.delete('/artists/:id', artistControllers.delete);

// album

app.post('/artists/:id/albums', albumControllers.createAlbum);

app.get('/artists/:id/albums', albumControllers.getAlbumsByArtistId);

app.get('/artists/:artistId/albums/:albumId', albumControllers.getOneAlbum);

app.patch('/artists/:artistId/albums/:albumId', albumControllers.updateAlbum);

app.delete('/artists/:artistId/albums/:albumId', albumControllers.deleteAlbum);

// song

app.post('/album/:id/songs', songsControllers.createSong);

app.get('/album/:id/songs', songsControllers.getAllSongs);

app.get('album/:albumId/songs/:songId', songsControllers.getOneSong);

module.exports = app;
