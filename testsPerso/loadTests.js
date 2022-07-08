const { io } = require("socket.io-client");

const URL = "http://localhost:3000";
const MAX_CLIENTS = 100;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 100;
const EMIT_INTERVAL_IN_MS = 50;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSendLastReport = 0
let packetsRecivedLastReport = 0;
let latances = 0;
let totalLatances = 0

const createClient = () => {
    // for demonstration purposes, some clients stay stuck in HTTP long-polling
    const transports = Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

    const socket = io(URL, {
        transports,
    });

    let nbr = 0

    list = []

    setInterval(() => {
        socket.emit("ping", nbr);

        list[nbr] = new Date().getTime();
        nbr++;

        packetsSendLastReport++;
    }, EMIT_INTERVAL_IN_MS);

    socket.on("pong", (nbr) => {

        let lantance = new Date().getTime() - list[nbr]
        if (!isNaN(lantance)) {
            latances += lantance;
            totalLatances++;
        }

        delete list[nbr];
        packetsRecivedLastReport++;
    });

    socket.on("disconnect", (reason) => {
        console.log(`disconnect due to ${reason}`);
    });
};

setInterval(() => {
    if (clientCount < MAX_CLIENTS) {
        createClient();
        clientCount++;
    }
}, CLIENT_CREATION_INTERVAL_IN_MS);

const printReport = () => {
    const now = new Date().getTime();
    const durationSinceLastReport = (now - lastReport) / 1000;
    const packetsSendPerSeconds = (packetsSendLastReport / durationSinceLastReport).toFixed(2);
    const packetsRecivedPerSeconds = (packetsRecivedLastReport / durationSinceLastReport).toFixed(2);
    const avglatances = latances / totalLatances;
    console.log(
        `client: ${clientCount} ; packets send (/s): ${packetsSendPerSeconds} ; packets recived (/s): ${packetsRecivedPerSeconds}`
    );
    console.log('Avg latances:', avglatances);

    packetsSendLastReport = 0
    packetsRecivedLastReport = 0;
    latances = 0;
    totalLatances = 0;
    lastReport = now;
};

setInterval(printReport, 1000);