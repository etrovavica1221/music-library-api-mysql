const { Artist } = require('../models');
const { Album } = require('../models');

exports.createAlbum = (req, res) => {
  const { id } = req.params;

  Artist.findByPk(id).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.create(req.body).then((album) => {
        album.setArtist(id).then((connectedAlbum) => {
          res.status(201).send(connectedAlbum);
        });
      });
    }
  });
};

exports.getAlbumsByArtistId = (req, res) => {
  const { id } = req.params;

  Artist.findByPk(id).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.findAll({ where: { id: id } }).then((foundAlbums) =>
        res.status(200).json(foundAlbums)
      );
    }
  });
};
