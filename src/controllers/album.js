const { Artist } = require('../models');
const { Album } = require('../models');

exports.createAlbum = (req, res) => {
  const { id } = req.params;

  Artist.findByPk(id).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else if (req.body[0]) {
      const promiseArr = req.body.map((entry) => {
        Album.create(entry).then((album) => album.setArtist(foundArtist));
      });

      Promise.all(promiseArr)
        .catch((err) => console.log('something failed to resolve', err))
        .then((albums) => res.status(201).json(albums));
    } else {
      Album.create({ year: req.body.year, name: req.body.name }).then(
        (album) => {
          album.setArtist(foundArtist).then((updatedAlbum) => {
            res.status(201).json(updatedAlbum);
          });
        }
      );
    }
  });
};

exports.getAlbumsByArtistId = (req, res) => {
  const { id } = req.params;

  Artist.findByPk(id).then((foundArtist) => {
    if (!foundArtist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      Album.findAll({ where: { artistId: artistId } }).then((foundAlbums) =>
        res.status(200).json(foundAlbums)
      );
    }
  });
};
