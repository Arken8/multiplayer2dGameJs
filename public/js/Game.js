import { getCurrentPlayer, addPlayers, removePlayers, newLocations } from "./Players.js";
import { movePlayer } from "./Interactions.js";
import { render } from "./Render.js";
import { transformInArray } from "./Utils.js"

const socket = io();

/* GAME */

// Update
var lastT = 0;
var hasMoved = false;

function update() {
    // interactions
    let deltaT = (Date.now() - lastT) / 1000;
    //console.log(deltaT);

    if (movePlayer(deltaT) == true) {
        hasMoved = true;
    }
    lastT = Date.now()

    render();
}
setInterval(update, 1000/60);

// var lastPing = 0;

function updateSockets() {
    if (hasMoved) {
        let loc = getCurrentPlayer().LocationT.Location;
        socket.volatile.emit('move', {x: loc.x, y: loc.y});
        hasMoved = false;
    }

    /* Latance test
    lastPing = Date.now();
    socket.emit('ping');
    */
}
setInterval(updateSockets, 1000/10);

// Sockets
/* Latance test
socket.on('pong', () => {
    console.log(Date.now() - lastPing);
})
*/

socket.on('id', (id) => {
    getCurrentPlayer().id = id;
});

socket.on('connections', (list) => {

    list = transformInArray(list);

    let playersNotMe = [];
    let myId = getCurrentPlayer().id;

    for (let i = 0; i < list.length; i++) {
        let listi = list[i];
        if (listi.id != myId) {
            playersNotMe.push(listi);
        }
    }

    addPlayers(playersNotMe);
    console.log("connections", playersNotMe)
});

socket.on('disconnections', (list) => {
    removePlayers(list);
    console.log("disconnections", list);
});

socket.on('locations', (list) => {
    newLocations(list);
});

socket.on('color', (color) => {
    getCurrentPlayer().color = color;
});
