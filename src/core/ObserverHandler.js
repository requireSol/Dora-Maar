import {requestSubscription, subscriptionQueue, SubscriptionDescriptor} from "./SubscriptionManager.js";
import {dataObjects} from "./DataHandler.js";
import {CandlesRequest, OrderBookRequest, TickerRequest, TradesRequest} from "../model/requests.js";
import {orderBookTypeConstants, tradesTypeConstants} from "../common/Constants.js";
import {ChannelObserverMap} from "../common/collections/ChannelObserverMap.js";

/**
 * Structure to manage observer and channels
 * @type {ChannelObserverMap}
 */
export let channelObserverMapping = new ChannelObserverMap();

/**
 * Registers an observer for specific data updates.
 * @param {Observer|ObserverBaseElement} observer the observer that requested data
 * @param {ClientRequest} clientRequest the object to request specific data
 */
export function requestData(observer, clientRequest) {
    stopDataRequest(observer); // only one subscription per observer
    if (clientRequest.isValid) {
        const subDesc = new SubscriptionDescriptor(observer, clientRequest);
        requestSubscription(subDesc);
    } else {
        console.error("invalid request: ");
        console.error(clientRequest.validationInfo);
    }

}

/**
 * Assigns the observer to the channel id that matches its data request.
 * @param {Number} chanId
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @private
 */
export function assignObserverToId(chanId, subDesc) {
    channelObserverMapping.mapSubDescToChannel(subDesc, chanId);

    const dataObject = dataObjects.get(chanId);
    informObserver({"level": "success", "title": "data is available"}, [subDesc]);
    updateOneObserver(subDesc, dataObject);
}

/**
 * Unregisters an observer from its requested data.
 * @param {Observer|ObserverBaseElement} observer the observer to unregister
 */
export function stopDataRequest(observer) {
    channelObserverMapping.removeObserver(observer);
    subscriptionQueue.remove(observer);

}

/**
 * Updates an observer with order book data.
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @param {OrderBookData} bookDataObject the object containing the order book data.
 */
function updateOrderBookObserver(subDesc, bookDataObject) {
    const clientRequest = subDesc.clientRequest;
    const source = subDesc.observer;
    const type = clientRequest["askOrBid"];
    let eventData;

    if (type === orderBookTypeConstants.ASK && (bookDataObject.askUpdated)) {
        eventData = bookDataObject.ask.slice(0, clientRequest["recordCount"]);
        source.update(eventData, bookDataObject.askNewPriceLevels);
        return;
    }
    if (type === orderBookTypeConstants.BID && bookDataObject.bidUpdated) {
        eventData = bookDataObject.bid.slice(0, clientRequest["recordCount"]);
        source.update(eventData, bookDataObject.bidNewPriceLevels);
    }

}

/**
 * Updates an observer with ticker data.
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @param {TickerData} tickerDataObject
 * @param {boolean} needInitialData
 */
function updateTickerObserver(subDesc, tickerDataObject, needInitialData) {
    const clientRequest = subDesc.clientRequest;
    const source = subDesc.observer;
    const recordCount = (needInitialData) ? clientRequest["initialRecordCount"] : clientRequest["recordCount"];
    const eventData = tickerDataObject.data.slice(0, recordCount);
    source.update(eventData);
}

/**
 * Updates the observer with trades data.
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @param {TradesData} tradesDataObject
 * @param {boolean} needInitialData
 */
function updateTradesObserver(subDesc, tradesDataObject, needInitialData) {
    const clientRequest = subDesc.clientRequest;
    const source = subDesc.observer;
    const type = clientRequest["soldOrBoughtOrBoth"];
    const recordCount = (needInitialData) ? clientRequest["initialRecordCount"] : clientRequest["recordCount"];
    let eventData;

    if (type === tradesTypeConstants.SOLD && (tradesDataObject.soldUpdated || needInitialData)) {
        eventData = tradesDataObject.sold.slice(0, recordCount);
        source.update(eventData);
        return;
    }
    if (type === tradesTypeConstants.BOUGHT && (tradesDataObject.boughtUpdated || needInitialData)) {
        eventData = tradesDataObject.bought.slice(0, recordCount);
        source.update(eventData);
        return;
    }
    if (type === tradesTypeConstants.BOTH && (tradesDataObject.bothUpdated || needInitialData)) {
        eventData = tradesDataObject.both.slice(0, recordCount);
        source.update(eventData);
    }
}

/**
 * Updates the observer with candle data.
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @param {CandlesData} CandlesDataObject
 * @param {boolean} needInitialData
 */
function updateCandlesObserver(subDesc, CandlesDataObject, needInitialData) {
    const clientRequest = subDesc.clientRequest;
    const source = subDesc.observer;
    const recordCount = (needInitialData) ? clientRequest["initialRecordCount"] : clientRequest["recordCount"];
    const eventData = CandlesDataObject.candles.slice(0, recordCount);

    let metadata = new Map();
    metadata.set("isInitialData", needInitialData);
    metadata.set("globalLow", CandlesDataObject.globalLow);
    metadata.set("globalHigh", CandlesDataObject.globalHigh);
    metadata.set("updatedTimeStampIndex", CandlesDataObject.updatedTimeStampIndex);
    metadata.set("hasNewTimeStamp", CandlesDataObject.hasNewTimeStamp);

    source.update(eventData, metadata);
}

/**
 * Updates an observer with the data in dataObject.
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @param {DataObject} dataObject
 */
export function updateOneObserver(subDesc, dataObject) {
    if (dataObject === undefined)
        return;

    const needInitialData = subDesc.needInitialData;

    const clientRequest = subDesc.clientRequest;
    subDesc.needInitialData = false;

    if (clientRequest instanceof OrderBookRequest) {
        updateOrderBookObserver(subDesc, dataObject);
    }
    if (clientRequest instanceof TickerRequest) {
        updateTickerObserver(subDesc, dataObject, needInitialData);
    }
    if (clientRequest instanceof TradesRequest) {
        updateTradesObserver(subDesc, dataObject, needInitialData);
    }
    if (clientRequest instanceof CandlesRequest) {
        updateCandlesObserver(subDesc, dataObject, needInitialData);
    }
}

/**
 * Updates all observers, which subscribed to the channel specified by the id.
 * @param {Number} chanId the channel's id
 */
export function updateAllObservers(chanId) {
    const dataObject = dataObjects.get(chanId);
    for (const observer of channelObserverMapping.subscriptionDescriptorsOfChannel(chanId)) {
        updateOneObserver(observer, dataObject);
    }
}

/**
 * Sends a message to the observers of a channel.
 * @param {Object} message the message to send
 * @param {Number|Array} chanIdOrListOfSubDesc the channel id for channel specific observers or null for all observers
 */
export function informObserver(message, chanIdOrListOfSubDesc = null) {
    if (chanIdOrListOfSubDesc instanceof Number) {
        for (const subDesc of channelObserverMapping.subscriptionDescriptorsOfChannel(chanIdOrListOfSubDesc)) {
            subDesc.observer.info(message);
        }
    } else if (chanIdOrListOfSubDesc instanceof Array) {
        for (const subDesc of chanIdOrListOfSubDesc) {
            subDesc.observer.info(message);
        }
    } else {
        for (const observer of channelObserverMapping.allObservers()) {
            observer.info(message);
        }
    }
}
