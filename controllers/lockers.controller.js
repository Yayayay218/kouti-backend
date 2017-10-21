var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var HTTPStatus = require('../helpers/lib/http_status');
var constant = require('../helpers/lib/constant');

var Lockers = mongoose.model('Lockers');
var Cus = mongoose.model('Cus');
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var getCuDetail = function (id) {
    return new Promise(function (resolve, reject) {
        Cus.findById(id, function (err, data) {
            if (err)
                reject(err)
            else {
                resolve(data);
            }
        })
    })
};

//  POST a Locker
module.exports.lockerPOST = function (req, res) {
    getCuDetail(req.body.cuID).then(function (cu) {
        req.body.bid = cu.cuBoardAddress + req.body.lockerID;
        var data = req.body;
        var locker = new Lockers(data);

        locker.save(function (err, locker) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                cu.lockers.push(locker._id);
                cu.save();
                setTimeout(function () {
                    res.status(HTTPStatus.CREATED).json({
                        success: true,
                        message: "Add a new locker successful !",
                        data: locker
                    })
                }, 500);
            }
        });
    }).catch(function (err) {
        console.log(err)
    })

};

//  GET All Lockers
module.exports.lockerGetAll = function (req, res) {
    var query = req.query || {};

    const page = Number(req.query.page);
    delete req.query.page;
    const limit = Number(req.query.limit);
    delete req.query.limit;
    const sort = req.query.sort;
    delete req.query.sort;
    const status = req.query.status;

    if (req.query.available)
        query = {
            "available": {$in: req.query.available}
        };
    if (req.query.status)
        query = {
            "status": {$in: status}
        };

    if (req.query.id)
        query = {
            "_id": {$in: req.query.id}
        };

    Lockers.paginate(
        query,
        {
            sort: sort,
            populate: 'orders',
            page: page,
            limit: limit
        }, function (err, locker) {
            if (err)
                res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
            else {
                var results = {
                    data: locker.docs,
                    total: locker.total,
                    limit: locker.limit,
                    page: locker.page,
                    pages: locker.pages
                };
                sendJSONresponse(res, HTTPStatus.OK, results);
            }
        });
};

//  GET a Locker
module.exports.lockerGetOne = function (req, res) {
    Lockers.findById(req.params.id, function (err, locker) {
        if (err)
            sendJSONresponse(res, HTTPStatus.NOT_FOUND, err);
        else
            sendJSONresponse(res, HTTPStatus.OK,
                {
                    success: true,
                    message: "Find Locker Successful !",
                    data: locker
                });
    });
};

//  DEL a Locker
module.exports.lockerDEL = function (req, res) {
    if (req.params.id)
        Lockers.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                sendJSONresponse(res, 404, err);
            else
                sendJSONresponse(res, 204, {'message': 'success'});
        });
};

//  PUT a Locker
module.exports.lockerPUT = function (req, res) {
    req.body.updateAt = Date.now();
    var data = req.body;

    Lockers.findByIdAndUpdate(req.params.id, data, {'new': true}, function (err, locker) {
        if (err)
            sendJSONresponse(res, 400, err);
        else if (locker)
            sendJSONresponse(res, 201, {'data': locker});
        else
            sendJSONresponse(res, 404, {'message': 'locker not founded'});
    });
};

// module.exports.changePincode = function (req, res) {
//     Lockers.find(function (err, locker) {
//         console.log(locker);
//         locker.forEach(function (t, index) {
//             locker[index].pinCode = "000" + t.bid;
//             locker[index].save();
//         });
//         sendJSONresponse(res, 200, 'OK')
//     })
// };