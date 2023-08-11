const express = require('express');
const path = require('path')
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors')
const { router } = require('./routes');

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);



app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))


// Connect to DataBase
mongoose.connect('mongodb://localhost:27017/userTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('open', () => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use('/api', router)














