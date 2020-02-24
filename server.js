const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // Express has no built in parser
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));

// set up body parser as middleware with app.use
// .json tells bodyParser that we expect JSON to come in 
// with our request
app.use(bodyParser.json());

// what comes in from our browser is URlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// mongodb connection string
// var dbUrl = 'mongodb+srv://ibabalola:abcd1234@learning-node-fdcxp.mongodb.net/test?retryWrites=true&w=majority';
const localDbUrl = 'mongodb://localhost:27017/chat-client-db';

const messageSchema = {
    name: String,
    message: String
};

// a model for structured data storage, which will passed a schema
const Message = mongoose.model('Message', messageSchema);

// Add routes for endpointd
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.get('/messages/:user', (req, res) => {
    const user = req.params.user;
    Message.find({name: user}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/message', async (req, res) => {
    try {
        var message = new Message(req.body);
        await message.save();
        console.log('saved');
    
        var censored = await Message.findOne({ message: 'badword' });
        if (censored) 
            await Message.deleteOne({ _id: censored.id });
        else {
            // emit an event from the server to update all connected clients
            // notifying them of a new message
            io.emit('message', req.body);
        }
    
        // the response status of 200 lets the client know
        // that everything went well
        res.sendStatus(200);
    } catch (error){
        res.sendStatus(500);
        return console.log(error);
    } finally {
        // finally is usually used for logging
        // logger.log('message post called');
        console.log('message post called');
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

mongoose.connect(localDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => console.log('mongo db connection', err));

const server = http.listen(3000, () => {
    console.log(`server is listening on port ${server.address().port}`);
});