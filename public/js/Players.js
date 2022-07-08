import { transformInArray } from "./Utils.js"

export class Player {
    constructor(id) {
        this.id = String(id);
        this.name = "";
        this.health = 1000;
        this.LocationT = new LocationT(new Location(0, 0), Date.now());
        this.color = "#000000";
        this.walkSpeed = 100;
    }
}

export class Location {
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

export class ObjWithId {
    constructor(id, obj) {
        this.id = id;
        this.obj = obj;
    }
}

const currentPlayer = new Player(0);
var playerList = [];
var oldLocations = [];

export function getCurrentPlayer() {
    return currentPlayer;
}

export function getPlayerList() {
    return playerList;
}

export function newLocations(list) {
    // list doit etre une liste d' ObjWithId de Location

    list = transformInArray(list);
    let now = Date.now();
    const idList = getIdList(playerList);

    for (let i = 0; i < list.length; i++) {
        let listi = list[i];
        let id = listi.id;
        if (idList.includes(id)) {
            oldLocations[id] = Object.assign({}, getPlayerFromId(id).LocationT);
            getPlayerFromId(id).LocationT = new LocationT(listi.obj, now);
        }
    }
}

export function getPlayersActualLocations(interpolate) {

    if (interpolate === undefined) { interpolate = true; }

    if (!interpolate) {
        let playerLocations = [];
        for (let i = 0; i < playerList.length; i++) {
            let player = playerList[i];
            playerLocations.push(new ObjWithId(player.id, player.LocationT.Location));
        }
        return playerLocations;
    }

    let playerLocations = []

    for (let i = 0; i < playerList.length; i++) {
        let player = playerList[i];
        let before = oldLocations[player.id];
        let id = player.id;

        if (before === undefined) {
            playerLocations.push(new ObjWithId(id, player.LocationT.Location));
        } else {

            let location1 = before.Location, t1 = before.t;

            let after = player.LocationT;
            let location2 = after.Location, t2 = after.t;

            let deltaX = location2.x - location1.x;
            let deltaY = location2.y - location1.y;
            let percentage = (Date.now() - t2) / (t2 - t1);

            if (percentage >= 1) {
                playerLocations.push(new ObjWithId(id, location2));
                delete oldLocations[id];
            } else {
                playerLocations.push(new ObjWithId(id, new Location(
                        location1.x + deltaX * percentage, 
                        location1.y + deltaY * percentage
                        )));
            }
        }
    }
    return playerLocations; // return un ObjWithId de Location
}

export function addPlayers(list) {
    // list doit etre une liste de Player.

    list = transformInArray(list);
    const idList = getIdList(playerList);

    for (let i = 0; i < list.length; i++) {

        let listi = list[i];
        listi.id = String(listi.id);
        if (!idList.includes(listi.id)) {
            playerList.push(listi);
            idList.push(listi.id);
        }
    }
}

export function removePlayers(list) {
    // list doit etre une liste d'Id.

    list = list.slice()
    list = transformInArray(list);

    const idList = getIdList(playerList);
    const length = list.length;

    for (let i = 0; i < length; i++) {

        let id = list[i];

        if (idList.includes(id)) {
            let index = idList.indexOf(id); // Index du joueur dans la lisre des joueurs
            playerList.splice(index, 1);    // pb quand on fait pas deep copy
            idList.splice(index, 1);
            delete oldLocations[id];
        }
    }
}

export function getPlayerFromId(id) {
    id = String(id);
    let player;
    for (let i = 0; i < playerList.length; i++) {
        player = playerList[i];
        if (player.id == id) {
            return player;
        }
    }
}

export function getIdList(list) {
    const idList = [];
    for (let i = 0; i < list.length; i++) {
        idList.push(list[i].id);
    }
    return idList;
}

function rmIdList(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            list.splice(i, 1);
            return;
        }
    }
}

export default function() {}
