const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const path = require('path');


const userRoutes = require('./routes/users');
const employeeRoute = require('./routes/employee');
require('dotenv').config();
require('./config/database');

app.use(express.json());


// Serve static files from the 'public' directory and  uploads directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Public route to create users like regular user or admin
app.use('/users', userRoutes);

// accessing employee data after authentication
app.use('/employees', employeeRoute(io)); 

// Handling WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Listen on the http server, not the express app
server.listen(3000, () => console.log('Server running on port 3000'));
