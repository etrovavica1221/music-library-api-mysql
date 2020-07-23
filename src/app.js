const express = require('express');

const artistRouter = require('./routes/artist.js');
const albumRouter = require('./routes/album');

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

app.get('/artists/:artistId/albums', albumControllers.getAlbumsByArtistId);

app.get('/artists/:artistId/albums/:albumId', albumControllers.getOneAlbum);

app.patch('/artists/:artistId/albums/:albumId', albumControllers.updateAlbum);

app.delete('/artists/:artistId/albums/:albumId', albumControllers.deleteAlbum);

// song

app.post('/albums/:id/songs', songsControllers.createSong);

app.get('/albums/:id/songs', songsControllers.getAllSongs);

app.get('/albums/:albumId/songs/:songId', songsControllers.getOneSong);

app.patch('/albums/:albumId/songs/:songId', songsControllers.updateSong);

app.delete('/albums/:albumId/songs/:songId', songsControllers.deleteSong);

module.exports = app;
