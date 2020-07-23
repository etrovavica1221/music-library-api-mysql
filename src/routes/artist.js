const artistControllers = require('../controllers/artist');
const express = require('express');
const router = express.Router();

router.post('/', artistControllers.create);

router.get('/', artistControllers.list);

router.get('/:id', artistControllers.getArtistById);

router.patch('/:id', artistControllers.updateArtist);

router.delete('/:id', artistControllers.delete);

module.exports = router;
