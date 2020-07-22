/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/models');

describe('/songs', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: 'InnerSpeaker',
        year: 2010,
        artistId: artist.id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  // POST

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/album/${album.id}/songs`)
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Solitude Is Bliss');
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
          done();
        });
    });

    it('returns a 404 and does not create a song if the album does not exist', (done) => {
      request(app)
        .post(`/album/12345/songs`)
        .send({
          name: 'doesnt really matter',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.');

          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        });
    });
  });

  // GET

  describe('with songs in the database', () => {
    let songs;
    beforeEach((done) => {
      Promise.all([
        Song.create({
          name: 'Live Forever',
          artistId: artist.id,
          albumId: album.id,
        }),
        Song.create({
          name: 'Take On Me',
          artistId: artist.id,
          albumId: album.id,
        }),
        Song.create({
          name: 'Wind of change',
          artistId: artist.id,
          albumId: album.id,
        }),
      ]).then((documents) => {
        songs = documents;
        done();
      });
    });

    describe('GET /album/:albumId/songs', () => {
      it('gets all songs of one album', (done) => {
        request(app)
          .get(`/album/${album.id}/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(songs.length).to.equal(3);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
              expect(song.artistId).to.equal(artist.id);
              expect(song.albumId).to.equal(album.id);
            });
            done();
          });
      });
    });

    describe('GET /album/:albumId/songs/:songId', () => {
      it('gets a song by id', (done) => {
        let song = songs[0];
        let album = albums[0];
        request(app)
          .get(`/album/${album.id}/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(song.name);
            expect(res.body.artistId).to.equal(artist.id);
            expect(res.body.albumId).to.equal(album.id);
            done();
          });
      });

      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .get(`/album/12345/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          });
      });

      it('returns a 404 if the song does not exist', (done) => {
        request(app)
          .get(`/album/${album.id}/songs/12345`)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The song could not be found.');
            done();
          });
      });
    });
  });
});
