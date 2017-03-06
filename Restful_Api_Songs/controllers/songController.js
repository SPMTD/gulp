require('mongoose-pagination');

var songController = function (Song) {

    var newPageNext, newPagePrev;

    var post = function (req, res) {

        var song = new Song(req.body);

        if (!req.body.artist) {
            res.status(400).send('Artist is required');
        } else if (!req.body.title) {
            res.status(400).send('Title is required');
        } else if (!req.body.genre) {
            res.status(400).send('Genre name is required');
        } else {
            song.save();
            res.status(201);
            res.send(song);
        }

    };

    var get = function (req, res, next) {
        var page = parseInt(req.query.start);

        var query = {};

        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        Song.find().exec((err, countData) => {
            if (err) {
                return next(err);
            }
            var countItems = countData.length;
            var limit = parseInt(req.query.limit) || countItems;
            var songs = {};
            var exclude = {__v: 0};

            Song.find({}, exclude)
                .paginate(page, limit)
                .exec((err, data) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        if (limit > countItems) {
                            limit = countItems;
                        }
                    }

                    var totalPages = Math.ceil(countItems / limit);

                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (!req.accepts('json')) {
                            res.status(406).send('Not Acceptable');
                        } else {
                            if (totalPages <= 1) {
                                newPagePrev = 1;
                                nextPagePrev = 1;
                            }

                            if (page <= totalPages) {
                                newPageNext = page + 1;
                            }

                            if (page > 1) {
                                newPagePrev = page - 1;
                            }

                            var items = songs.items = [];
                            var links = songs._links = {};
                            links.self = {};
                            links.self.href = 'http://' + req.headers.host + '/api/songs';

                            var pagination = songs.pagination = {};
                            pagination.currentPage = page;
                            pagination.currentItems = limit;
                            pagination.totalPages = totalPages;
                            pagination.totalItems = countItems;

                            var paginationLinks = pagination._links = {};
                            paginationLinks.first = {};
                            paginationLinks.last = {};
                            paginationLinks.previous = {};
                            paginationLinks.next = {};


                            paginationLinks.first.page = 1;
                            paginationLinks.first.href = 'http://' + req.headers.host + '/api/songs/?' + 'start=' + 1 + '&limit=' + limit;

                            paginationLinks.last.page = totalPages;
                            paginationLinks.last.href = 'http://' + req.headers.host + '/api/songs/?' + 'start=' + totalPages + '&limit=' + limit;

                            paginationLinks.previous.page = newPagePrev;
                            paginationLinks.previous.href = 'http://' + req.headers.host + '/api/songs/?' + 'start=' + newPagePrev + '&limit=' + limit;

                            paginationLinks.next.page = newPageNext;
                            paginationLinks.next.href = 'http://' + req.headers.host + '/api/songs/?' + 'start=' + newPageNext + '&limit=' + limit;

                            song.forEach(function (element, index, array, exclude) {
                                var newSong = element.toJSON();
                                newSong._links = {};
                                newSong._links.self = {};
                                newSong._links.collection = {};
                                newSong._links.self.href = 'http://' + req.headers.host + '/api/songs/' + newSong._id;
                                newSong._links.collection.href = 'http://' + req.headers.host + '/api/songs';

                                returnSongs.push(newSong);
                            });
                            res.json(collection);
                        }
                    }

                    Song.find(query, function (err, song) {
                        if (err)
                            res.status(500).send(err);
                        else
                            var returnSongs = [];
                        var exclude = {__v: 0};

                        if (err) {
                            res.status(500).send(err);
                        } else {
                            if (!req.accepts('json')) {
                                res.status(406).send('Not Acceptable');
                            }

                            var collection = {};
                            collection.items = returnSongs;

                            collection.pagination = {};
                            collection._links = {};
                        }
                    })

                });

            var options = function (req, res) {
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
                return res.send();
            };

            var getSong = function (req, res) {

                var returnSong = req.song.toJSON();

                returnSong._links = {};
                var newLink = 'http://' + req.headers.host + '/api/songs/?genre=' + returnSong.genre;
                returnSong._links.FilterByThisGenre = newLink.replace(' ', '%20');
                res.json(returnSong);
            };

            var putSong = function (req, res) {
                req.song.title = req.body.title;
                req.song.artist = req.body.artist;
                req.song.genre = req.body.genre;
                req.song.heard = req.body.heard;
                req.song.save(function (err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(req.song);
                    }
                });
            };

            var patchSong = function (req, res) {
                if (req.body._id)
                    delete req.body._id;
                for (var p in req.body) {
                    req.song[p] = req.body[p];
                }
                req.song.save(function (err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(req.song);
                    }
                })
            };

            var deleteSong = function (req, res) {
                req.song.remove(function (err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.status(204).send('Removed');
                    }
                });
            };

            var optionSong = function (req, res) {
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
                res.end();
            };


            return{
                post: post,
                get: get,
                options: options,

                getSong: getSong,
                putSong: putSong,
                patchSong: patchSong,
                deleteSong: deleteSong,
                optionSong: optionSong
            };
        });
    }
};
module.exports = songController;