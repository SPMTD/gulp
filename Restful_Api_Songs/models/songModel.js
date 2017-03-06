var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mongoosePaginate = require('mongoose-paginate');

var songModel = new Schema({
        title: {type: String},
        artist: {type: String},
        genre: {type: String},
        heard: {type: Boolean, default:true}
});
mongoose.plugin(mongoosePaginate);

module.exports = mongoose.model('Song', songModel);