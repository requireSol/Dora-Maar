import {send} from "./Connector.js";
import {observer, assignObserverToId, informObserver} from "./ObserverHandler.js";
import {remove as removeDataObject} from "./DataHandler.js"
import {SubDescriptorQueue} from "../common/collections/SubDescriptorQueue.js";
import {eventConstants} from "../common/Constants";


let subscribedChannels = new Map();
/**
 * Sent subscription requests for which no response has yet been received.
 */
export let pendingQueue = new SubDescriptorQueue();

/**
 * Subscription requests that have not yet been sent to the server.
 */
export let subscriptionQueue = new SubDescriptorQueue();

/**
 * Channel ids to resubscribe.
 */
export let resubscriptionChannels = new Set();

/**
 * Unsubscription requests that have not yet been sent to the server.
 */
export let unsubscriptionQueue = new Set();

/**
 * Sent unsubscription requests for which no response has yet been received.
 */
export let pendingUnsubscriptions = new Set();

/**
 * Handles a subscription event from the server.
 * @param {Object} subscriptionEvent the subscription event from the server
 */
export function internalSubscribe(subscriptionEvent) {
    const ID = subscriptionEvent["chanId"];
    const list = pendingQueue.popMatchingRequestsSubDescriptors(subscriptionEvent);
    for (const subDesc of list) {
        subscribedChannels.set(ID, subDesc.apiRequest);
        assignObserverToId(ID, subDesc);
    }
}

/**
 * Handles an unsubscription event from the server.
 * @param {Object} unsubscriptionEvent the unsubscription event from the server
 */
export function internalUnsubscribe(unsubscriptionEvent) {
    if (unsubscriptionEvent["status"] === "OK") {

        const chanId = unsubscriptionEvent["chanId"];
        if (chanId !== undefined && subscribedChannels.has(chanId)) {
            const observers = observer.get(chanId);
            pendingUnsubscriptions.delete(chanId);
            removeDataObject(chanId);
            observer.delete(chanId);
            subscribedChannels.delete(chanId);
            if (resubscriptionChannels.has(chanId)) {
                resubscriptionChannels.delete(chanId);
                //Notify observer that data stream is closed
                informObserver({
                    "level": "info",
                    "title": "resubscribing",
                    "msg": "data stream is closed due to resubscribing"
                }, observers);
                for (const subDesc of observers) {
                    requestSubscription(subDesc);
                }
            } else {
                informObserver({
                    "level": "info",
                    "title": "data stream closed",
                    "msg": "data stream is closed"
                }, observers);
            }
        }
    }
}

/**
 * Requests a subscription from the server.
 * @param {SubscriptionDescriptor} subDesc the requested subscription
 */
export function requestSubscription(subDesc) {
    const channelId = subDesc.channelId;
    if (channelId === null) {
        const isPending = pendingQueue.isAlreadyInQueue(subDesc);
        if (isPending) {
            pendingQueue.add(subDesc);
        } else {
            const hasBeenSent = send(JSON.stringify(subDesc.apiRequest));
            if (hasBeenSent) {
                pendingQueue.add(subDesc);
            } else {
                subscriptionQueue.add(subDesc);
            }
        }
    } else {
        if (unsubscriptionQueue.delete(channelId)) {
            assignObserverToId(channelId, subDesc);

        } else if (pendingUnsubscriptions.delete(channelId)) {
            resubscriptionChannels.add(channelId);
        }
    }
}

/**
 * Request an unsubscription from the server.
 * @param {Number} chanId the channel's id
 */
export function requestUnsubscription(chanId) {
    const action = {
        "event": eventConstants.UNSUBSCRIBE,
        "chanId": chanId
    };
    if (!send(JSON.stringify(action))) {
        unsubscriptionQueue.add(chanId);
    } else {
        pendingUnsubscriptions.add(chanId);
    }
}

/**
 * Checks whether subscribeEventResponse is the response of the subscriptionRequest.
 * @param {Object} subscriptionEventResponse the response object
 * @param {APIRequest} subscriptionRequest the request object
 * @returns {boolean} whether subscribeEventResponse is the response of the subscriptionRequest
 */
export function responseMatchesRequest(subscriptionEventResponse, subscriptionRequest) {
    for (const key in subscriptionRequest) {
        if (subscriptionRequest.hasOwnProperty(key) && key !== "event" && subscriptionEventResponse.hasOwnProperty(key) && subscriptionRequest[key] !== subscriptionEventResponse[key]) {
            return false
        }
    }
    return true;
}

/**
 * Get the id's channel name.
 * @param {Number} channelID the channel's id
 * @returns {String} the id's channel name
 */
export function getChannelOfId(channelID) {
    const subscriptionRequest = subscribedChannels.get(channelID);
    return subscriptionRequest["channel"];
}

/**
 * Check whether both requests are equal.
 * @param {APIRequest} request1 an api request
 * @param {APIRequest} request2 an api request
 * @returns {boolean} whether both requests are equal
 * @private
 */
export function _requestEqualsRequest(request1, request2) {
    for (const p in request1) {
        if (request1.hasOwnProperty(p) && request2.hasOwnProperty(p) && request1[p] !== request2[p])
            return false;
        if (request1.hasOwnProperty(p) && !request2.hasOwnProperty(p))
            return false;
    }
    return true;
}

/**
 * Get the channel's id if the channel is already subscribed
 * @param {APIRequest} subscriptionRequest an api request
 * @returns {Number|null} the channel's id or null if the channel is not subscribed
 */
export function getIdFromRequest(subscriptionRequest) {
    for (const [id, request] of subscribedChannels.entries()) {
        if (_requestEqualsRequest(request, subscriptionRequest))
            return id;
    }
    return null;
}

/**
 * Resubscribes all currently subscribed channels.
 * @param {boolean} unsubscribeFirst send unsubscribe requests to the server, before request the subscriptions.
 */
export function resubscribeAllChannels(unsubscribeFirst = true) {
    for (const chanId of subscribedChannels.keys()) {
        resubscriptionChannels.add(chanId);
        if (unsubscribeFirst) {
            requestUnsubscription(chanId);
        } else {
            const unsubscribeEvent = {status: "OK", chanId: chanId};
            internalUnsubscribe(unsubscribeEvent);
        }
    }
}

/**
 * Requests the subscription of all queued requests.
 */
export function processAllQueuedRequests() {
    const size = subscriptionQueue.size();
    for (let i = 0; i < size; i++) {
        requestSubscription(subscriptionQueue.pop());
    }

}

/**
 * Requests the unsubscription of all queued channels.
 */
export function processAllQueuedUnsubscriptions() {
    const queueCopy = new Set(unsubscriptionQueue);
    unsubscriptionQueue.clear();
    for (const channelId of queueCopy) {
        requestUnsubscription(channelId);
    }
}

/**
 * Transfers all pending requests to the request queue.
 */
export function moveAllPendingRequestsInQueue() {
    const size = subscriptionQueue.size();
    for (let i = 0; i < size; i++) {
        subscriptionQueue.add(subscriptionQueue.pop());
    }
}

/**
 * Transfers all pending channels to unsubscribe to the unsubscription queue.
 */
export function moveAllPendingUnsupscriptionsInQueue() {
    for (const chanId of pendingUnsubscriptions) {
        unsubscriptionQueue.add(chanId);
    }
    pendingUnsubscriptions.clear();
}

/**
 * Clears the unsubscription queue.
 */
export function clearUnsubscriptionQueue() {
    unsubscriptionQueue.clear()
}

/**
 * Clears all pending unsubcriptions.
 */
export function clearPendingUnsubscriptions() {
    pendingUnsubscriptions.clear();
}






