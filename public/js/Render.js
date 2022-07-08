import { getPlayersActualLocations, getCurrentPlayer, getPlayerFromId } from "./Players.js";
const ctx = canvas.getContext("2d");

function drawPlayers() {

    let locationsWithId = getPlayersActualLocations();

    for (let i = 0; i < locationsWithId.length; i++) {
        let loc = locationsWithId[i];
        ctx.fillStyle = getPlayerFromId(loc.id).color;
        ctx.fillRect(loc.obj.x, loc.obj.y, 20, 20);
    }
    
    let currentPlayer = getCurrentPlayer();

    ctx.fillStyle = currentPlayer.color;
    let loc = currentPlayer.LocationT.Location;
    ctx.fillRect(loc.x, loc.y, 20, 20);
}

export function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
}

export default function() {}
