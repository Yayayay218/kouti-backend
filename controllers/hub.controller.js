var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Hubs = mongoose.model('Hubs');
var Cus = mongoose.model('Cus');
var Lockers = mongoose.model('Lockers');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//  POST a hub
module.exports.hubPOST = function (req, res) {
    var data = req.body;
    var hub = new Hubs(data);

    hub.save(function (err, hub) {
        if (err)
            res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
        else
            res.status(HTTPStatus.CREATED).json({
                success: true,
                message: "Add a new hub successful !",
                data: hub
            })
    });
};

//  GET All Hubs
module.exports.hubGetAll = function (req, res) {
    var query = req.query || {};

    const page = Number(req.query.page);
    delete req.query.page;
    const limit = Number(req.query.limit);
    delete req.query.limit;
    const sort = req.query.sort;
    delete req.query.sort;

    if (req.query.id)
        query = {
            "_id": {$in: req.query.id}
        };

    Hubs.paginate(
        query,
        {
            sort: sort,
            populate: {
                path: 'cu',
                populate: {
                    path: 'lockers',
                    populate: {
                        path: 'orders'
                    }
                }
            },
            page: page,
            limit: limit
        }, function (err, hub) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                var results = {
                    data: hub.docs,
                    total: hub.total,
                    limit: hub.limit,
                    page: hub.page,
                    pages: hub.pages
                };
                sendJSONresponse(res, HTTPStatus.OK, results);
            }
        });
};

//  GET a hub
module.exports.hubGetOne = function (req, res) {
    Hubs.findById(req.params.id)
        .populate({
            path: 'cu',
            populate: {
                path: 'lockers',
                populate: {
                    path: 'orders'
                }
            }
        })
        .exec(function (err, hub) {
            if (err)
                sendJSONresponse(res, HTTPStatus.NOT_FOUND, err);
            else {
                sendJSONresponse(res, HTTPStatus.OK,
                    {
                        success: true,
                        message: "Find hub Successful !",
                        data: hub
                    });
            }
        })
};

//  DEL a hub
module.exports.hubDEL = function (req, res) {
    if (req.params.id)
        Hubs.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONresponse(res, 404, err);
            else
                sendJSONresponse(res, 204, {'message': 'success'});
        });
};

//  PUT a hub
module.exports.hubPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;

    Hubs.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, hub) {
        if (err)
            sendJSONresponse(res, 400, err);
        else if (hub)
            sendJSONresponse(res, 201, {'data': hub});
        else
            sendJSONresponse(res, 404, {'message': 'hub not founded'});
    });
};