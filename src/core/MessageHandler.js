import {onRestoredWebSocketConnection} from "./Connector.js";
import {handleConnectionInfoMessage, handleErrorMessage, handleInfoMessage} from "./ErrorAndInfoHandler.js";
import {internalSubscribe, internalUnsubscribe} from "./SubscriptionManager.js";
import {create as createDataObject, dataObjects, update as updateDataObject} from "./DataHandler.js";
import {abortAction} from "./TimerAndActions.js";


const eventTypes = Object.freeze({
    error: "error",
    info: "info",
    subscribed: "subscribed",
    unsubscribed: "unsubscribed",
    pong: "pong"
});

/**
 * Handles every message send by the server
 * @param {Array} message
 */
export function handle(message) {
    const receivedData = JSON.parse(message["data"]);

    if (Array.isArray(receivedData)) {
        // is heartbeat
        const chanId = receivedData[0];
        if (receivedData.length === 2 && receivedData[1] === "hb") {

        } else {
            if (dataObjects.has(chanId)) {
                //is update
                console.log("data-update");
                updateDataObject(receivedData)
            } else {
                //is snapshot
                createDataObject(receivedData)
            }
        }

    } else if (receivedData.hasOwnProperty("event")) {
        switch (receivedData.event) {
            case eventTypes.error:
                handleErrorMessage(receivedData);

                break;

            case eventTypes.info:
                if (receivedData.hasOwnProperty("code")) {
                    handleInfoMessage(receivedData);
                } else {
                    //
                    handleConnectionInfoMessage(receivedData);
                }
                break;

            case eventTypes.subscribed:
                //console.log(receivedData);
                internalSubscribe(receivedData);

                break;

            case eventTypes.unsubscribed:
                internalUnsubscribe(receivedData);

                break;
            case
            eventTypes.pong:
                console.log("pong");
                if (abortAction("waitForPong")) {
                    onRestoredWebSocketConnection();
                }
                break;
        }
    }
}
