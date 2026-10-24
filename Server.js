const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path'); app.use(express.static(path.join(__dirname, 'public'))); let waitingUsers = []; io.on('connection', (socket) => { socket.on('findChat', (interests) => { socket.interests = interests; let matched = false; for (let i = 0; i < waitingUsers.length; i++) { let waitingUser = waitingUsers[i]; let common = interests.filter(value => waitingUser.interests.includes(value)); if (common.length > 0) { waitingUsers.splice(i, 1); let roomId = 'room_' + socket.id + '_' + waitingUser.id; socket.join(roomId); waitingUser.join(roomId); io.to(roomId).emit('matched', { roomId: roomId }); matched = true; break; } } if (!matched) { waitingUsers.push(socket); } }); socket.on('sendMessage', (data) => { io.to(data.roomId).emit('receiveMessage', data.message); }); socket.on('disconnect', () => { waitingUsers = waitingUsers.filter(user => user.id !== socket.id); });
}); http.listen(3000, () => { console.log('Listening on *:3000');
});

