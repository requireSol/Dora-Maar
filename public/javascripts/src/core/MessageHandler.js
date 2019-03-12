import {handleConnectionInfoMessage, handleErrorMessage, handleInfoMessage} from "./ErrorAndInfoHandler.js";
import {internalSubscribe, internalUnsubscribe, onRestoredWebSocketConnection, getChannelOfId} from "./SubscriptionManager.js";
import {create as createDataObject, dataObjects, update as updateDataObject} from "./DataHandler.js";
import {abortAction} from "./TimerAndActions.js";
import {eventConstants} from "../common/Constants.js";
import {updateAllObservers} from "./ObserverHandler.js";

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
                updateDataObject(receivedData);
                updateAllObservers(chanId);
            } else {
                //is snapshot
                createDataObject(receivedData, getChannelOfId(chanId));
                updateAllObservers(chanId);
            }
        }

    } else if (receivedData.hasOwnProperty("event")) {
        switch (receivedData.event) {
            case eventConstants.ERROR:
                handleErrorMessage(receivedData);

                break;

            case eventConstants.INFO:
                if (receivedData.hasOwnProperty("code")) {
                    handleInfoMessage(receivedData);
                } else {
                    //
                    handleConnectionInfoMessage(receivedData);
                }
                break;

            case eventConstants.SUBSCRIBED:
                //console.log(receivedData);
                internalSubscribe(receivedData);

                break;

            case eventConstants.UNSUBSCRIBED:
                internalUnsubscribe(receivedData);

                break;
            case eventConstants.PONG:
                console.log("pong");
                if (abortAction("waitForPong")) {
                    onRestoredWebSocketConnection();
                }
                break;
        }
    }
}
