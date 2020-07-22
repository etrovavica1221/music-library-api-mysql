const { Artist, Album } = require('../models');

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

  Artist.findByPk(id).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.findAll({ where: { id: id } }).then((album) =>
        res.status(200).json(album)
      );
    }
  });
};

exports.getOneAlbum = (req, res) => {
  const { artistId, albumId } = req.params;

  Artist.findByPk(artistId).then((artist) => {
    console.log(artist);
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.findOne({ where: { artistId: artistId, id: albumId } }).then(
        (album) => {
          if (!album) {
            res.status(404).json({ error: 'The album could not be found.' });
          } else {
            res.status(200).json(album);
          }
        }
      );
    }
  });
};

exports.updateAlbum = (req, res) => {
  const { albumId } = req.params;

  Album.update(req.body, { where: { id: albumId } }).then(([rowsUpdated]) => {
    if (!rowsUpdated) {
      res.status(404).json({ error: 'The album could not be found' });
    } else {
      res.status(200).json(rowsUpdated);
    }
  });
};

exports.deleteAlbum = (req, res) => {
  const { albumId } = req.params;

  Album.findByPk(albumId).then((album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      Album.destroy({ where: { id: albumId } }).then(() => {
        res.status(204).json({ message: 'The album was deleted' });
      });
    }
  });
};
