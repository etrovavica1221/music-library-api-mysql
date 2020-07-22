/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  // POST

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

  // GET

  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'Be here now', year: 1997 }).then((album) =>
          album.setArtist(artist)
        ),
        Album.create({ name: 'Definitely Maybe', year: 1994 }).then((album) =>
          album.setArtist(artist)
        ),
        Album.create({ name: 'Dig out your soul', year: 2008 }).then((album) =>
          album.setArtist(artist)
        ),
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });

    describe('GET /artists/:id/albums', () => {
      it('gets all albums records of one artist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/albums`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(albums.length).to.equal(3);
            res.body.forEach((album) => {
              const expected = albums.find((a) => a.id === album.id);
              expect(album.name).to.equal(expected.name);
              expect(album.year).to.equal(expected.year);
            });
            done();
          });
      });
    });

    describe('GET /artists/:artistId/albums/:albumId', () => {
      it('gets an album by id', (done) => {
        let album = albums[0];
        let artist = artist[0];
        request(app)
          .get(`/artists/${artist.id}/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(album.name);
            expect(res.body.year).to.equal(album.year);
            done();
          });
      });

      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get(`/artists/12345/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/albums/12345`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });
    });

    // PATCH

    describe('PATCH /artists/:artistId/albums/:albumId', () => {
      it('updates album name by id', (done) => {
        let album = albums[0];
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}`)
          .send({ name: 'Beatels' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum.name).to.equal('Beatels');
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .patch(`/artists/${artist.id}/albums/12345`)
          .send({ name: 'Beatels' })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found');
            done();
          });
      });

      it('updates album year by id', (done) => {
        let album = albums[0];
        request(app)
          .patch(`/artists/${artist.id}/albums/${album.id}`)
          .send({ year: 1996 })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum.year).to.equal(1996);
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .patch(`/artists/${artist.id}/albums/12345`)
          .send({ year: 1996 })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found');
            done();
          });
      });
    });

    // DELETE

    describe('DELETE /artists/:artistId/albums/:albumId', () => {
      it('deletes album by id', (done) => {
        let album = albums[0];
        request(app)
          .delete(`/artists/${artist.id}/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
              expect(updatedAlbum).to.equal(null);
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .delete(`/artists/${artist.id}/albums/12345`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });
    });
  });
});
