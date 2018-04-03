const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const compression = require('compression');
const path = require('path');
const winston = require('winston');
const methodOverride = require('method-override');
const moment = require('moment');
const __ = require('lodash');
const json2xls = require('json2xls');

// Database
const mongoose = require('mongoose');
// NOTE: Edit your mongodb connection configuration here.
mongoose.connect('mongodb://localhost:27017/teaching');
const Planner = mongoose.model('Planner', {
    type: String,
    leader: String,
    topics: String,
    notes: String,
    assessment: String,
    resources: String,
    week: String,
    date: { type: Date, default: Date.now }
});

let logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        }),
        // new(winston.transports.File)({ filename: 'somefile.log' })
    ]
});
app.set('port', process.env.PORT || 8080);
app.set('host', '0.0.0.0');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride())
app.use(json2xls.middleware);

app.use(compression()); //use compression
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Routes.
//  Get the data from db.
// Calculate week by pagination number.
//  Use moment to calculate it.

app.get('/', function(req, res) {
    var week_number = '1';

    Planner.find({ week: week_number }, {}, {
            sort: {
                date: -1 //Sort by Date Added DESC
            }
        },

        function(err, planners) {
            if (err) {
                logger.error(err);
                return;
            }
            var plannerMap = [];

            plannerMap = __.map(planners, function(planner) {
                var plan = planner._doc;
                plan['_id'] = planner._id;
                return plan;
            })

            // logger.info("plans", plannerMap)
            res.render('index', { planners: plannerMap });
        });

});

// Export excel
app.get('/:week', function(req, res) {
    logger.warn(req.query, req.body, req.params)
    var week_number = req.params.week || '1';
    Planner.find({ week: week_number }, {}, {
            sort: {
                date: -1 //Sort by Date Added DESC
            }
        },
        function(err, planners) {
            if (err) {
                logger.error(err);
                return;
            }
            var plannerMap = [];

            plannerMap = __.map(planners, function(planner) {
                var plan = planner._doc;
                plan['_id'] = planner._id;
                return plan;
            })

            // logger.info("plans", plannerMap)
            res.render('index', { planners: plannerMap });
        });

});

app.get('/export_excel/:week', function(req, res) {
    logger.warn(req.query);
    var week_number = req.params.week || '1';

    Planner.find({ week: week_number }, {}, {
            sort: {
                date: -1 //Sort by Date Added DESC
            }
        },
        function(err, planners) {
            if (err) {
                logger.error(err);
                return;
            }
            var plannerMap = [];

            plannerMap = __.map(planners, function(planner) {
                var plan = planner._doc;
                plan['_id'] = planner._id;
                return plan;
            })

            // logger.info("plans", plannerMap)
            res.xls('text' + '.xlsx', plannerMap);
        });



});

// Store the data to db
app.post('/', function(req, res) {
    var type = req.body.type;
    var leader = req.body.leader;
    var topics = req.body.topics;
    var notes = req.body.notes;
    var assessment = req.body.assessment;
    var resources = req.body.resources;
    var week = req.body.week;
    Planner.create({
        type: type,
        leader: leader,
        topics: topics,
        notes: notes,
        assessment: assessment,
        resources: resources,
        week: week
    }, function(err, awesome_instance) {
        if (err) return logger.error(err);
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            error: null,
            status: true,
            content: awesome_instance
        }));
        res.end('\n');
    });

});

// update the data to db
app.put('/', function(req, res) {
    var id = req.body.id;
    var type = req.body.type;
    var leader = req.body.leader;
    var topics = req.body.topics;
    var notes = req.body.notes;
    var assessment = req.body.assessment;
    var resources = req.body.resources;
    Planner.findById(id, function(err, plan) {
        if (err) return logger.erro(err);
        plan.set({ type: type });
        plan.set({ leader: leader });
        plan.set({ topics: topics });
        plan.set({ notes: notes });
        plan.set({ assessment: assessment });
        plan.set({ resources: resources });

        plan.save(function(err, updatedPlan) {
            if (err) return handleError(err);
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.write(JSON.stringify({
                error: null,
                status: true
            }));
            res.end('\n');
        });
    });

});

// Delete data from db.
app.delete('/', function(req, res) {
    var id = req.body.id;
    Planner.findByIdAndRemove(id, function(err, planner) {
        if (err) return handleError(err);
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.write(JSON.stringify({
            error: null,
            status: planner
        }));
        res.end('\n');
    });
});

app.listen(app.get('port'), app.get('host'), function() {
    logger.info('Listening on ' + app.get("host") + ':' + app.get('port'));
});