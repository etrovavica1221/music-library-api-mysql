const { Album, Song } = require('../models');

exports.createSong = (req, res) => {
  const { id } = req.params;

  Album.findByPk(id).then((album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      const songData = {
        name: req.body.name,
        albumId: album.id,
        artistId: req.body.artist,
      };
      Song.create(songData).then((song) => {
        res.status(201).json(song);
      });
    }
  });
};

exports.getAllSongs = (req, res) => {
  const { id } = req.params;

  Album.findByPk(id).then((album) => {
    if (!album) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      Song.findAll({ where: { id: id } }).then((song) =>
        res.status(200).json(song)
      );
    }
  });
};

exports.getOneSong = (req, res) => {
  const { albumId, songId } = req.params;
  Album.findByPk(albumId).then((album) => {
    if (album === null || Object.keys(album).length === 0) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      Song.findAll({ where: { albumId: albumId, id: songId } }).then((song) => {
        if (song.length === 0) {
          res.status(404).json({ error: 'The song could not be found.' });
        } else {
          res.status(200).json(song);
        }
      });
    }
  });
};

exports.updateSong = (req, res) => {
  const { albumId, songId } = req.params;

  Song.update(req.body, { where: { albumId: albumId, id: songId } })
    .then(([rowsUpdated]) => {
      if (rowsUpdated === 0) {
        res.status(404).json({ error: 'The song could not be found' });
      } else {
        res.status(200).json(rowsUpdated);
      }
    })
    .catch(console.log);
};

exports.deleteSong = (req, res) => {
  const { songId } = req.params;

  Song.findByPk(songId).then((song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      Song.destroy({ where: { id: songId } }).then(() => {
        res.status(204).json({ message: 'The song was deleted' });
      });
    }
  });
};
