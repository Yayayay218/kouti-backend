var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var autoIncre = require('mongoose-sequence');

var ordersSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    updateAt: Date,
    createAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    },
    lockerID: {type: Schema.Types.ObjectId, ref: 'Lockers', required: true}
});

ordersSchema.plugin(mongoosePaginate);
ordersSchema.plugin(autoIncre, {inc_field: 'order_id'});
mongoose.model('Orders', ordersSchema);