const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let leaderboard = [];
try {
  leaderboard = JSON.parse(fs.readFileSync('./leaderboard.json', 'utf8'));
} catch (e) {
  leaderboard = [];
}

let waitingPlayer = null;

io.on('connection', (socket) => {
  // Leaderboard Events
  socket.on('get-leaderboard', () => {
    socket.emit('leaderboard', leaderboard);
  });

  socket.on('submit-score', (entry) => {
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
    leaderboard = leaderboard.slice(0, 50);
    fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard));
    io.emit('leaderboard', leaderboard);
  });

  // Matchmaking
  socket.on('find-match', (playerInfo) => {
    socket.playerInfo = playerInfo;

    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      const room = `room-${Date.now()}`;
      socket.join(room);
      waitingPlayer.join(room);

      const seed = Math.random();

      // Notify both players
      io.to(room).emit('match-found', {
        room,
        seed,
        players: [
          { id: waitingPlayer.id, name: waitingPlayer.playerInfo.name },
          { id: socket.id, name: playerInfo.name }
        ]
      });

      socket.currentRoom = room;
      waitingPlayer.currentRoom = room;
      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit('waiting-match');
    }
  });

  // Game Relay
  socket.on('crosshair-update', (data) => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('opponent-crosshair', data);
    }
  });

  socket.on('duck-hit', (data) => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('opponent-duck-hit', data);
    }
  });

  socket.on('leave-match', () => {
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('opponent-left');
      socket.leave(socket.currentRoom);
      socket.currentRoom = null;
    }
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });

  socket.on('disconnect', () => {
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
    if (socket.currentRoom) {
      socket.to(socket.currentRoom).emit('opponent-left');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
