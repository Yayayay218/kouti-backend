var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var cuSchema = new mongoose.Schema({
    cuBoardAddress: String,
    lockers: [{type: Schema.Types.ObjectId, ref: 'Lockers'}],
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: Date,
    hubID: {type: Schema.Types.ObjectId, ref: 'Hubs'}
});

cuSchema.plugin(mongoosePaginate);
mongoose.model('Cus', cuSchema);