import {OrderBookData} from "../model/OrderBookData.js";
import {TickerData} from "../model/TickerData.js";
import {TradesData} from "../model/TradesData.js";
import {CandlesData} from "../model/CandlesData.js";
import {channelConstants} from "../common/Constants.js";

export let dataObjects = new Map();

/**
 * Handles an update message from the server
 * @param receivedFromServer the API update message
 */

export function update(receivedFromServer) {
    const chanId = receivedFromServer[0];
    const updateData = receivedFromServer.splice(1, receivedFromServer.length);
    const dataObject = dataObjects.get(chanId);
    dataObject.update(updateData);
}

/**
 * Handles a snapshot message from the server
 * @param {Array} receivedFromServer the API snapshot message
 * @param {String} channel the data's channel
 */
export function create(receivedFromServer, channel) {

    const chanId = receivedFromServer[0];
    const snapshotData = receivedFromServer[1];
    switch (channel) {
        case channelConstants.ORDERBOOK:
            dataObjects.set(chanId, new OrderBookData(snapshotData));
            break;
        case channelConstants.TICKER:
            dataObjects.set(chanId, new TickerData(snapshotData));
            break;
        case channelConstants.TRADES:
            dataObjects.set(chanId, new TradesData(snapshotData));
            break;
        case channelConstants.CANDLES:
            dataObjects.set(chanId, new CandlesData(snapshotData));
            break;
    }
}

/**
 * Delete the local channel data
 * @param {Number} chanId the channel's id
 */
export function remove(chanId) {
    dataObjects.delete(chanId);
}
 