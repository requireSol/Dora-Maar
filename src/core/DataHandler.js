import {updateAllObservers} from "./ObserverHandler.js";
import {getChannelOfId} from "./SubscriptionManager.js";
import {OrderBookData} from "../model/OrderBookData.js";
import {TickerData} from "../model/TickerData.js";
import {TradesData} from "../model/TradesData.js";
import {CandlesData} from "../model/CandlesData.js";

export let dataObjects = new Map();

/**
 * Handles an update message from the server
 * @param receivedFromServer the API update message
 */

export function update(receivedFromServer) {
    const chanId = receivedFromServer[0];
    const updateData = receivedFromServer.splice(1, receivedFromServer.length);
    dataObjects.get(chanId).update(updateData);
    updateAllObservers(chanId);

}

/**
 * Handles a snapshot message from the server
 * @param {Array} receivedFromServer the API snapshot message
 */
export function create(receivedFromServer) {

    const chanId = receivedFromServer[0];
    const snapshotData = receivedFromServer[1];
    const channel = getChannelOfId(chanId);
    switch (channel) {
        case "book":
            dataObjects.set(chanId, new OrderBookData(snapshotData));
            break;
        case "ticker":
            dataObjects.set(chanId, new TickerData(snapshotData));
            break;
        case "trades":
            dataObjects.set(chanId, new TradesData(snapshotData));
            break;
        case "candles":
            dataObjects.set(chanId, new CandlesData(snapshotData));
            break;
    }
    updateAllObservers(chanId);

}

/**
 * Delete the local channel data
 * @param {Number} chanId the channel's id
 */
export function remove(chanId) {
    dataObjects.delete(chanId);
}
 