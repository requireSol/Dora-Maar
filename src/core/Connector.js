import {handle as handleMessage} from "./MessageHandler.js";
import {informObserver} from "./ObserverHandler.js";
import {executeAction, startTimer, stopTimer} from "./TimerAndActions.js";
import {eventConstants, platformConstants} from "../common/Constants.js";

const url = "wss://api.bitfinex.com/ws/2";

let webSocket = null;

export let platformStatus = -1;

export let supportedVersion = 2;

export let serverId = null;

export function setServerId(id) {
    serverId = id;
}

export function setPlatformStatus(status) {
    platformStatus = status;
}

/**
 * Initializes the API.
 */
export function initialize() {
    window.addEventListener('online', function (e) {
        informObserver({
            "level": "success",
            "title": "connection restored",
            "msg": "connected to the internet"
        });
        executeAction("waitForPong", 1000);
        executeAction("pingWebSocket");

    });
    window.addEventListener('offline', function (e) {
        informObserver({
            "level": "warn",
            "title": "connection lost",
            "msg": "waiting for connection"
        });


    });
    if (navigator.onLine) {
        connect();
    } else {
        // offline mode
        informObserver({
            "level": "warn",
            "title": "no internet connection",
            "msg": "waiting for connection"
        });
    }
    startTimer("cleanUnusedData");
}

/**
 * Sends data to the connected server if possible.
 * @param {String} data the data to be sent
 * @returns {boolean} whether the data could be sent to the server.
 */
export function send(data) {
    if (navigator.onLine && webSocket instanceof WebSocket && webSocket.readyState === WebSocket.OPEN
        && platformStatus === platformConstants.OPERATIVE) {
        webSocket.send(data);
        return true;
    }
    return false;
}

/**
 * Sends a ping message to the connected server if possible
 */
export function pingWebSocket() {
    const action = {event: eventConstants.PING};
    if (!send(JSON.stringify(action))) {

    }
}

/**
 * Establishes a connection with the server
 */
function connect() {
    if (!navigator.onLine) {
        return;
    }

    webSocket = new WebSocket(url);

    webSocket.onmessage = handleMessage;

    webSocket.onopen = function () {
        stopTimer("reconnect");
        console.log("onopen");


    };
    webSocket.onerror = function (err) {
        console.log("onerror");
        console.log(err);
    };

    webSocket.onclose = function (evt) {
        console.log("onclose");
        console.log(evt);
        if (evt.code !== 1000) {
            informObserver({
                "level": "warn",
                "title": "websocket closed",
                "msg": "websocket connection closed, trying to reconnect"
            });
            startTimer("reconnect");

        } else {
            console.info("connection closed normally");
        }
    }
}

/**
 * Closes the current connection and tries to reconnect to the server.
 */
export function reconnect() {
    if (webSocket !== null && (webSocket.readyState !== WebSocket.CLOSED || webSocket.readyState !== WebSocket.CLOSING)) {
        webSocket.onclose = function () {
        };
        webSocket.close();
    }
    connect();
}


