var express = require('express');
var bodyParser = require('body-parser'); // Express has no built in parser
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));

// set up body parser as middleware with app.use
// .json tells bodyParser that we expect JSON to come in 
// with our request
app.use(bodyParser.json());

// what comes in from our browser is URlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// mongodb connection string
var dbUrl = 'mongodb+srv://ibabalola:abcd1234@learning-node-fdcxp.mongodb.net/test?retryWrites=true&w=majority';

var messages = [
    { name: 'Tim', message: 'Messages' },
    { name: 'Isaac', message: 'Messages' },
    { name: 'Victoria', message: 'Messages' }
];

// Add routes for endpointd
app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/message', (req, res) => {
    console.log('body', req.body);
    messages.push(req.body);
    // the response status of 200 lets the client know
    // that everything went well
    res.sendStatus(200);

    // emit an event from the server to update all connected clients
    // notifying them of a new message
    io.emit('message', req.body);

});

io.on('connection', (socket) => {
    console.log('a user connected');
});

mongoose.connect(dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true }, 
    (err) => console.log('mongo db connection', err));

var server = http.listen(3000, () => {
    console.log(`server is listening on port ${server.address().port}`);
});