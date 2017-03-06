var express = require('express');

var routes = function(Song){
    var songRouter = express.Router();
    var songController = require('../controllers/songController')(Song);

    songRouter.route('/')
        .post(songController.post)
        .get(songController.get)
        .options(songController.options);

    songRouter.use('/:songId', function (req, res, next) {
        var exclude = {__v: 0};

        Song.findById(req.params.songId, exclude, function (err, song) {
            if(err)
                res.status(500).send(err);
            else if(song){
                req.song = song;
                next();
            }
            else
            {
                res.status(404).send('no song found');
            }
        });
    });

    songRouter.route('/:songId')
        .get(songController.getSong)
        .put(songController.putSong)
        .patch(songController.patchSong)
        .delete(songController.deleteSong)
        .options(songController.optionSong);
        return songRouter;
};

module.exports = routes;