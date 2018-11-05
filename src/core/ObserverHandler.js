import {requestSubscription, subscriptionQueue, unsubscriptionQueue} from "./SubscriptionManager.js";
import {dataObjects} from "./DataHandler.js";
import {CandlesRequest, OrderBookRequest, TickerRequest, TradesRequest} from "../model/requests.js";
import {SubscriptionDescriptor} from "../common/collections/SubDescriptorQueue.js";

/**
 * Maps channel ids to SubscriptionDescriptors
 */
export let observer = new Map();

/**
 * Maps observers to channel ids
 */
let observerChanIdMapping = new Map();

/**
 * Registers an observer for specific data updates.
 * @param {Observer|ObserverBaseElement} observer the observer that requested data
 * @param {ClientRequest} clientRequest the object to request specific data
 */
export function requestData(observer, clientRequest) {
    stopDataRequest(observer); // only one subscription per observer
    const subDesc = new SubscriptionDescriptor(observer, clientRequest);
    requestSubscription(subDesc);
}

/**
 * Assigns the observer to the channel id that matches its data request.
 * @param {Number} chanId
 * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor containing the observer
 * @private
 */
export function assignObserverToId(chanId, subDesc) {
    let obs = [];
    if (observer.has(chanId)) {
        obs = observer.get(chanId);
    }
    obs.push(subDesc);

    observerChanIdMapping.set(subDesc.observer, chanId);
    observer.set(chanId, obs);

    const dataObject = dataObjects.get(chanId);
    informObserver({"level": "success", "title": "data is available"}, [subDesc]);
    updateOneObserver(subDesc, dataObject);
}

/**
 * Unregisters an observer from its requested data.
 * @param {Observer|ObserverBaseElement} observer2 the observer to unregister
 */
export function stopDataRequest(observer2) {
    const chanId = observerChanIdMapping.get(observer2);
    if (chanId !== undefined) {
        const subDescs = observer.get(chanId);
        for (let i = subDescs.length - 1; i >= 0; i--) {
            if (subDescs[i].observer === observer2) {
                subDescs.splice(i, 1);
                break;
            }
        }
        observerChanIdMapping.delete(observer);
    }
    subscriptionQueue.remove(observer);

}

/**
 * Converts client requests to api requests
 * @param {ClientRequest} clientRequest the client request
 * @returns {APIRequest} the api requests for the server
 * @private
 */
export function convertToApiRequest(clientRequest) {
    if (clientRequest instanceof OrderBookRequest)
        return {
            event: "subscribe",
            channel: "book",
            len: (clientRequest["recordCount"] <= 25) ? "25" : "100",
            freq: (clientRequest["updateRate"] === "realtime") ? "F0" : "F1",
            prec: clientRequest["precision"],
            symbol: "t" + clientRequest["currencyPair"]
        };

    if (clientRequest instanceof TickerRequest)
        return {
            event: "subscribe",
            channel: "ticker",
            symbol: "t" + clientRequest["currencyPair"]
        };

    if (clientRequest instanceof TradesRequest)
        return {
            event: "subscribe",
            channel: "trades",
            symbol: "t" + clientRequest["currencyPair"]
        };

    if (clientRequest instanceof CandlesRequest)
        return {
            event: "subscribe",
            channel: "candles",
            key: "trade:" + clientRequest["timeFrame"] + ":t" + clientRequest["currencyPair"]
        }
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

    if (type === "ask" && (bookDataObject.askUpdated)) {
        eventData = bookDataObject.ask.slice(0, clientRequest["recordCount"]);
        source.update(eventData, bookDataObject.askNewPriceLevels);
        return;
    }
    if (type === "bid" && bookDataObject.bidUpdated) {
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

    if (type === "sold" && (tradesDataObject.soldUpdated || needInitialData)) {
        eventData = tradesDataObject.sold.slice(0, recordCount);
        source.update(eventData);
        return;
    }
    if (type === "bought" && (tradesDataObject.boughtUpdated || needInitialData)) {
        eventData = tradesDataObject.bought.slice(0, recordCount);
        source.update(eventData);
        return;
    }
    if (type === "both" && (tradesDataObject.bothUpdated || needInitialData)) {
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

    source.update(eventData);
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
    const obs = observer.get(chanId);
    if (obs === undefined)
        return;
    const dataObject = dataObjects.get(chanId);
    for (let i = 0; i < obs.length; i++) {
        updateOneObserver(obs[i], dataObject)
    }
}

/**
 * Sends a message to the observers of a channel.
 * @param {Object} message the message to send
 * @param {Number|Array} chanIdOrListOfSubDesc the channel id for channel specific observers or null for all observers
 */
export function informObserver(message, chanIdOrListOfSubDesc = null) {
    if (chanIdOrListOfSubDesc instanceof Number) {
        for (const subDesc of observer.get(chanIdOrListOfSubDesc)) {
            subDesc.observer.info(message);
        }
    } else if (chanIdOrListOfSubDesc instanceof Array) {
        for (const subDesc of chanIdOrListOfSubDesc) {
            subDesc.observer.info(message);
        }
    } else {
        for (const listOfSubDesc of observer.values()) {
            for (const subDesc of listOfSubDesc) {
                subDesc.observer.info(message);
            }
        }
    }
}
