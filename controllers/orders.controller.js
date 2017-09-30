var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var constant = require('../helpers/lib/constant');

var Orders = mongoose.model('Orders');
var Lockers = mongoose.model('Lockers');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var checkAndUpdateLockerAvailable = function (id) {
    return new Promise(function (resolve, reject) {
        Lockers.findOne({_id: id}, function (err, locker) {
            if (err) {
                reject(err);
            }
            resolve(locker);
        });
    });
};
//  POST a Order
module.exports.orderPOST = function (req, res) {
    var data = req.body;
    var order = new Orders(data);

    checkAndUpdateLockerAvailable(req.body.lockerID)
        .then(function (locker) {
            if (locker.available === constant.AVAILABLE) {
                locker.available = 0;
                order.save(function (err, order) {
                    if (err)
                        sendJSONResponse(res, 400, err);
                    else {
                        locker.orders.push(order._id);
                        locker.save();
                        setTimeout(function () {
                            sendJSONResponse(res, 201, order);
                        }, 500)
                    }
                });
                return;
            }
            sendJSONResponse(res, 400, {message: 'Locker is not available'});
        })
        .catch(function (err) {
            sendJSONResponse(res, 400, err);
        });
};

//  GET All Orders
module.exports.orderGetAll = function (req, res) {
    var query = req.query || {};

    const page = Number(req.query.page);
    delete req.query.page;
    const limit = Number(req.query.limit);
    delete req.query.limit;
    const sort = req.query.sort;
    delete req.query.sort;

    if (req.query.status)
        query = {
            "status": {$in: req.query.status}
        };
    if (req.query.id)
        query = {
            "_id": {$in: req.query.id}
        };
    Orders.paginate(
        query,
        {
            sort: sort,
            page: page,
            limit: limit
        }, function (err, order) {
            if (err)
                sendJSONResponse(res, 404, err);
            else {
                var results = {
                    data: order.docs,
                    total: order.total,
                    limit: order.limit,
                    page: order.page,
                    pages: order.pages
                };
                sendJSONResponse(res, 201, results);
            }
        });
};

//  GET a Order
module.exports.orderGetOne = function (req, res) {
    Orders.findById(req.params.id, function (err, order) {
        if (err)
            sendJSONResponse(res, 404, err);
        else
            sendJSONResponse(res, 200, {'data': order});
    })
};

//  PUT a Order
module.exports.orderPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;
    Orders.findByIdAndUpdate(
        req.params.id,
        data,
        {'new': true})
        .exec(function (err, order) {
            if (err) {
                sendJSONResponse(res, 400, err);
                return;
            }
            if (order) {
                checkAndUpdateLockerAvailable(order.lockerID)
                    .then(function (locker) {
                        locker.updateAt = Date.now();
                        locker.previousPinCode = locker.pinCode;
                        locker.pinCode = req.body.pinCode;
                        if (data.status == 2)
                            locker.available = 1;
                        locker.save();
                        order.locker = locker;
                        sendJSONResponse(res, 200, order);
                    })
                    .catch(function (err) {
                        sendJSONResponse(res, 400, err);
                    });
            }
            else
                sendJSONResponse(res, 404, {message: 'Order Not Fount'});
        })

};

//  DEL a Order
module.exports.orderDEL = function (req, res) {
    if (req.params.id)
        Orders.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONResponse(res, 404, err);
            else
                sendJSONResponse(res, 204, {'message': 'success'});
        });
};