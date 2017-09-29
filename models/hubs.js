var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var hubsSchema = new mongoose.Schema({
    hubName: String,
    password: {
        type: String,
        required: true
    },
    serviceUUID: String,
    charUUID: String,
    cu: [
        {type: Schema.Types.ObjectId, ref: 'Cus'}
    ],
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: Date
});

hubsSchema.plugin(mongoosePaginate);
mongoose.model('Hubs', hubsSchema);