var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var lockersSchema = new mongoose.Schema({
    lockerID: String,
    box: {
        type: String,
        required: true
    },
    bid: String,
    status: {
        type: Number,
        default: 0
    },
    updateAt: Date,
    pinCode: String,
    previousPinCode: String,
    available: {
        type: Number,
        default: 1
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    cuID: {type: Schema.Types.ObjectId, ref: 'Cus'},
    orders: [{type: Schema.Types.ObjectId, ref: 'Orders'}]
});

lockersSchema.plugin(mongoosePaginate);
mongoose.model('Lockers', lockersSchema);