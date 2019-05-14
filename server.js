const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let IssueModel = require("./modules/issues");
let request = require("http");


const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');
// mongoose.connect('mongodb://ec2-3-95-160-139.compute-1.amazonaws.com:27017/test');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB connection established successfully...!!!');
});

router.route('/issues').get((req, resp) => {
    IssueModel.find((err, issues) => {
        if (err) {
            resp.json({
                'responseData': [],
                'message': err,
                'status': false,
            });
        }
        else {
            resp.json({
                'responseData': issues,
                'message': 'Isuues list fectched successfully.',
                'status': true
            });
        }
    });
});

router.route('/issues/:id').get((req, resp) => {
    IssueModel.findById(req.params.id, (err, issue) => {
        if (err) {
            resp.json({
                'responseData': {},
                'message': err,
                'status': false,
            })
        }
        else {
            resp.json({
                'status': true,
                'responseData': issue,
                'message': 'Isuue details fectched successfully.'
            });
        }
    });
});

router.route('/issues/add').post((req, resp) => {
    let issue = new IssueModel(req.body);
    issue.save().then(issue => {
        resp.status(200).json({
            'message': 'Issue added successfully.',
            'status': true,
            'responseData': issue
        });
    }).catch(err => {
        resp.status(400).send(json({
            'message': err,
            'status': false,
            'responseData': {}
        }));
    });
});

router.route('/issues/update/:id').post((req, resp) => {
    IssueModel.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                resp.status(200).json({
                    'message': 'Issue updated successfully.',
                    'responseData': issue,
                    'status': true 
                });
            }).catch(err => {
                resp.status(400).send(json({
                    'message':err,
                    'status': false,
                    responseData: {}
                }));
            });
        }
    });
});

router.route('/issues/delete/:id').get((req, resp) => {
    IssueModel.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
        if (err) resp.json(err);
        else { resp.json('Issue removed successfully...!!!'); }
    });
});
app.use('/', router);

// app.get('/', (req, res) => res.send('Hello World...!!!'));

app.listen(4000, () => {
    console.log('Express server is running on port: 4000');
})