export class ChannelObserverMap {
    constructor() {
        /**
         * @type {Map<Number, Set<SubscriptionDescriptor>>}
         */
        this.chanIdToObserver = new Map();
        /**
         * @type {Map<Observer|ObserverBaseElement, Number>}
         */
        this.observerToChanId = new Map();
    }

    /**
     * Maps a SubscriptionDescriptor to a channel id.
     * @param {SubscriptionDescriptor} subDesc
     * @param {Number} chanId
     */
    mapSubDescToChannel(subDesc, chanId) {
        let subDescSet = new Set();
        if (this.chanIdToObserver.has(chanId)) {
            subDescSet = this.chanIdToObserver.get(chanId)
        }
        subDescSet.add(subDesc);
        this.chanIdToObserver.set(chanId, subDescSet);

        this.observerToChanId.set(subDesc.observer, chanId);
    }

    /**
     * Removes all observer related mapping entries.
     * @param {Observer|ObserverBaseElement} observer the observer to remove
     */
    removeObserver(observer) {
        if (this.observerToChanId.has(observer)) {
            const chanId = this.observerToChanId.get(observer);
            this.observerToChanId.delete(observer);

            let subDescSet = this.chanIdToObserver.get(chanId);
            subDescSet.delete(observer);
            this.chanIdToObserver.set(chanId, subDescSet);
            // maybe assignment is unnecessary
        }
    }

    /**
     * Removes all channel related mapping entries.
     * @param {Number} chanId the channel's id
     */
    removeChannel(chanId) {
        if (this.chanIdToObserver.has(chanId)) {
            const subDescSet = this.chanIdToObserver.get(chanId);
            this.chanIdToObserver.delete(chanId);

            for (const subDesc of subDescSet.values()) {
                this.observerToChanId.delete(subDesc.observer);
            }
        }
    }

    /**
     * Get the SubscriptionDescriptors of a channel.
     * @param {Number} chanId the channel's id
     * @returns {IterableIterator<SubscriptionDescriptor>} an iterator of observers
     */
    subscriptionDescriptorsOfChannel(chanId) {
        if (this.chanIdToObserver.has(chanId)) {
            return this.chanIdToObserver.get(chanId).values();
        }
        return [].values();
    }

    /**
     * Get all observers.
     * @returns {IterableIterator<Observer|ObserverBaseElement>}
     */
    allObservers() {
        return this.observerToChanId.keys();
    }

    /**
     * Get all subscribed but unused channels.
     * @returns {IterableIterator<Number>}
     */
    emptyChannels() {
        let emptyChannels = [];
        for (const [chanId, observerSet] of this.chanIdToObserver.entries()) {
            if (observerSet.size === 0) {
                emptyChannels.push(chanId);
            }
        }
        return emptyChannels.values();
    }








}