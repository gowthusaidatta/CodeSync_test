// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Basic session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory user store (for demo only!)
const users = {};

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public/signup.html')));
app.get('/editor', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public/editor.html'));
  } else {
    res.redirect('/login');
  }
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send('User already exists.');
  }
  users[username] = { password };
  req.session.user = username;
  res.redirect('/editor');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    req.session.user = username;
    res.redirect('/editor');
  } else {
    res.send('Invalid credentials.');
  }
});

// Socket.io for live code sync
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('code-change', (code) => {
    socket.broadcast.emit('code-update', code);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
