export class SubDescriptorQueue {
    constructor() {
        /**
         * @type {Map<SubscriptionDescriptor, Number>}
         */
        this.sourcePositionMapping = new Map();
        this.queue = [];
        this.offset = 0;
    }

    /**
     * Clears all queued elements.
     */
    clear() {
        this.sourcePositionMapping.clear();
        this.queue.length = 0;
        this.offset = 0;
    }
    size() {
        return this.queue.length;
    }
    /**
     * Adds an element to the queue.
     * @param {SubscriptionDescriptor} subDesc the element to be added
     */
    add(subDesc) {
        if (this.sourcePositionMapping.has(subDesc.observer)) {
            const position = this.sourcePositionMapping.get(subDesc.observer) - this.offset;
            this.queue[position] = subDesc;
        } else {
            const position = this.queue.length + this.offset;
            this.sourcePositionMapping.set(subDesc.observer, position);
            this.queue.push(subDesc);
        }
    }

    /**
     * Removes and returns the first element from the queue.
     * @returns {SubscriptionDescriptor|null}
     */
    pop() {
        if (this.queue.length === 0) {
            return null;
        }
        const subDesc = this.queue.shift();
        this.sourcePositionMapping.delete(subDesc.observer);
        this.offset += 1;
        return subDesc;
    }

    /**
     * Removes a SubscriptionDescriptor from the queue.
     * @param {Observer|ObserverBaseElement} source the observer of the SubscriptionDescriptor
     * @returns {boolean} whether the SubscriptionDescriptor was in the queue
     */
    remove(source) {
        let position = this.sourcePositionMapping.get(source);
        if (position !== undefined) {
            position -= this.offset;
            this.sourcePositionMapping.delete(source);
            this.queue.splice(position, 1);
            return true;
        }
        return false;
    }

    /**
     * Removes and returns all SubscriptionDescriptors that match the response.
     * @param {Object} response
     * @returns {Array} the matching SubscriptionDescriptors
     */
    popMatchingRequestsSubDescriptors(response) {
        let matchingSubDescriptors = [];
        for (let i = this.queue.length - 1; i >= 0; i--) {
            const subDesc = this.queue[i];
            if (responseMatchesRequest(response, subDesc.apiRequest)) {
                matchingSubDescriptors.push(subDesc);
                this.sourcePositionMapping.delete(subDesc.observer);
                this.queue.splice(i, 1);
            }
        }
        return matchingSubDescriptors;
    }

    /**
     * Tests whether a SubscriptionDescriptor is already in the queue.
     * @param {SubscriptionDescriptor} subDesc the SubscriptionDescriptor to be checked
     * @returns {boolean} whether the SubscriptionDescriptor is in the queue
     */
    isAlreadyInQueue(subDesc) {
        for (const queuedSubDesc of this.queue) {
            if (requestEqualsRequest(queuedSubDesc.apiRequest, subDesc.apiRequest)) {
                return true;
            }
        }
        return false;
    }

}

/**
 * Checks whether subscribeEventResponse is the response of the subscriptionRequest.
 * @param {Object} subscriptionEventResponse the response object
 * @param {APIRequest} subscriptionRequest the request object
 * @returns {boolean} whether subscribeEventResponse is the response of the subscriptionRequest
 */
function responseMatchesRequest(subscriptionEventResponse, subscriptionRequest) {
    for (const key in subscriptionRequest) {
        if (subscriptionRequest.hasOwnProperty(key) && key !== "event" && subscriptionEventResponse.hasOwnProperty(key) && subscriptionRequest[key] != subscriptionEventResponse[key]) { // not !== bc of integer and string conversion
            return false
        }
    }
    return true;
}

/**
 * Check whether both requests are equal.
 * @param {APIRequest} request1 an api request
 * @param {APIRequest} request2 an api request
 * @returns {boolean} whether both requests are equal
 * @private
 */
export function requestEqualsRequest(request1, request2) {
    for (const p in request1) {
        if (request1.hasOwnProperty(p) && request2.hasOwnProperty(p) && request1[p] !== request2[p])
            return false;
        if (request1.hasOwnProperty(p) && !request2.hasOwnProperty(p))
            return false;
    }
    return true;
}