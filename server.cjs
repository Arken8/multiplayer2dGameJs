const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io')
const io = socketIo(server);

var players = [];
var idList = [];

// App

app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

// Sockets
class Player {
    constructor(id) {
        this.id = String(id);
        this.name = "";
        this.health = 1000;
        this.LocationT = new LocationT(new Location(0, 0), Date.now());
        this.color = "#000000";
        this.walkSpeed = 100;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class LocationT {
    constructor(Location, t) {
        this.Location = Location;
        this.t = t;
    }
}

class ObjWithId {
    constructor(id, obj) {
        this.id = id;
        this.obj = obj;
    }
}

io.on('connection', (socket) => {
    console.log('New connection.');

    let id = socket.id;
    let player = new Player(id);
    player.color = "#"+((1<<24)*Math.random()|0).toString(16);

    idList.push(id)
    players[id] = player;

    socket.emit('id', id);

    socket.emit('color', player.color);

    socket.emit('connections', getPlayerList());
    io.emit('connections', [player]);

    socket.on('disconnect', () => {
        console.log("Connection closed.");
        io.emit('disconnections', [player.id]);
        idList.splice(idList.indexOf(id), 1);
        delete players[id];
    });

    /* Latance test
    socket.on('ping', (nbr) => {
        if (nbr === undefined) {
            socket.emit('pong');
        } else {
            socket.emit('pong', nbr);
        }
    })
    */

    socket.on('move', ({x: x, y: y}) => {
        player = players[id];
        player.LocationT.Location.x = x;
        player.LocationT.Location.y = y;
    })
});

/*
function update() {

}
*/

function updateSockets() {
    let list = []

    for (let i = 0; i < idList.length; i++) {
        let player = players[idList[i]];
        list.push(new ObjWithId(player.id, player.LocationT.Location));
    }

    io.volatile.emit('locations', list);
} 
// nombre de ms entre chaque synchronisation
// (les clients auront un retard de 3 fois ce delai pour les positions interpolés)
// (un retard de 2 fois ce delai pour le reste)
// ne pas coublier de mettre a jour le client
setInterval(updateSockets, 1000/10);

function getIdList(list) {
    const idList = [];
    for (let i = 0; i < list.length; i++) {
        idList.push(list[i].id);
    }
    return idList;
}

function getPlayerList() {
    let list = [];
    for (let i = 0; i < idList.length; i++) {
        list.push(players[idList[i]]);
    }
    return list;
}

// HttpServer
server.listen(3000, () => {
    console.log('listening on port 3000.');
});
