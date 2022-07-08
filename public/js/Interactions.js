import { getCurrentPlayer } from "./Players.js";
const player = getCurrentPlayer();
const walkSpeed = player.walkSpeed;

const racine2 = Math.sqrt(2);

// keyboard
const Keyboard = [];

window.onkeydown = function(e) {
    Keyboard[e.key] = true;
};

window.onkeyup = function(e) {
    delete Keyboard[e.key];
};

export function movePlayer(deltaT) {

    let dx = 0;
    let dy = 0;

    if (Keyboard["z"] || Keyboard["ArrowUp"]) {
        dy -= walkSpeed * deltaT;
    }
    if (Keyboard["q"] || Keyboard["ArrowLeft"]) {
        dx -= walkSpeed * deltaT;
    }
    if (Keyboard["s"] || Keyboard["ArrowDown"]) {
        dy += walkSpeed * deltaT;
    }
    if (Keyboard["d"] || Keyboard["ArrowRight"]) {
        dx += walkSpeed * deltaT;
    }

    if (dx != 0 && dy != 0) {
        dx /= racine2;
        dy /= racine2;
    }

    player.LocationT.Location.x += dx;
    player.LocationT.Location.y += dy;
    return (dx != 0 || dy != 0);
}

export default function() {}
