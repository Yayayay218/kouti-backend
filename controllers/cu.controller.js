var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Hubs = mongoose.model('Hubs');
var Cus = mongoose.model('Cus');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var getHubById = function (id) {
    return new Promise(function (resolve, reject) {
        Hubs.findById(id, function (err, data) {
            if (err)
                reject(err);
            else resolve(data)
        })
    })
};

//  POST a cu
module.exports.cuPOST = function (req, res) {
    getHubById(req.body.hubID).then(function (hub) {
        var data = req.body;
        var cu = new Cus(data);

        cu.save(function (err, cu) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                hub.cu.push(cu._id);
                hub.save();
                setTimeout(function () {
                    res.status(HTTPStatus.CREATED).json({
                        success: true,
                        message: "Add a new cu successful !",
                        data: cu
                    })
                }, 500);

            }
        });
    }).catch(function (err) {
        console.log(err)
    });

};

//  GET All Cus
module.exports.cuGetAll = function (req, res) {
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
    if (req.query.hub)
        query = {
            "hubID": {$in: req.query.hubID}
        };

    Cus.paginate(
        query,
        {
            sort: sort,
            populate: 'hubID',
            page: page,
            limit: limit
        }, function (err, cu) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                var results = {
                    data: cu.docs,
                    total: cu.total,
                    limit: cu.limit,
                    page: cu.page,
                    pages: cu.pages
                };
                sendJSONresponse(res, HTTPStatus.OK, results);
            }
        });
};

//  GET a cu
module.exports.cuGetOne = function (req, res) {
    Cus.findById(req.params.id, function (err, cu) {
        if (err)
            sendJSONresponse(res, HTTPStatus.NOT_FOUND, err);
        else
            sendJSONresponse(res, HTTPStatus.OK,
                {
                    success: true,
                    message: "Find cu Successful !",
                    data: cu
                });
    });
};

//  DEL a cu
module.exports.cuDEL = function (req, res) {
    if (req.params.id)
        Cus.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONresponse(res, 404, err);
            else
                sendJSONresponse(res, 204, {'message': 'success'});
        });
};

//  PUT a cu
module.exports.cuPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;

    Cus.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, cu) {
        if (err)
            sendJSONresponse(res, 400, err);
        else if (cu)
            sendJSONresponse(res, 201, {'data': cu});
        else
            sendJSONresponse(res, 404, {'message': 'cu not founded'});
    });
};