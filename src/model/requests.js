class OrderBookRequest {
    /**
     * Object to request order book data.
     * @param precision the precision of the price
     * @param recordCount number of entries, maximum number is 90
     * @param askOrBid the order book's type, ask or bid
     * @param currencyPair the order book's currency pair
     * @param updateRate the update frequency, real time or every two seconds
     * @constructor
     */
    constructor(precision, recordCount, askOrBid, currencyPair, updateRate) {
        this.precision = precision;
        this.recordCount = recordCount;
        this.askOrBid = askOrBid;
        this.currencyPair = currencyPair;
        this.updateRate = updateRate;
    }
}

class TickerRequest {
    /**
     * Object to request ticker data.
     * @param currencyPair the ticker's currency pair
     * @param recordCount the maximum number of records
     * @param initialRecordCount the maximum number of records of the first update
     * @constructor
     */
    constructor(currencyPair, recordCount, initialRecordCount) {
        this.currencyPair = currencyPair;
        this.recordCount = recordCount;
        this.initialRecordCount = initialRecordCount;
    }
}

class TradesRequest {
    /**
     * Object to request trades data.
     * @param currencyPair the trades' currency pair
     * @param recordCount the maximum number of records
     * @param soldOrBoughtOrBoth the type of entries, only sold, only bought or sold and both records
     * @param initialRecordCount the maximum number of records of the first update
     * @constructor
     */
    constructor(currencyPair, recordCount, soldOrBoughtOrBoth, initialRecordCount) {
        this.currencyPair = currencyPair;
        this.recordCount = recordCount;
        this.soldOrBoughtOrBoth = soldOrBoughtOrBoth;
        this.initialRecordCount = initialRecordCount;
    }
}

class CandlesRequest {
    /**
     * Object to request candles data.
     * @param currencyPair the candles' currency pair
     * @param timeFrame the time interval between two data points
     * @param recordCount the number of data points
     * @param initialRecordCount the number of data points of the first update
     * @constructor
     */
    constructor(currencyPair, timeFrame, recordCount, initialRecordCount) {
        this.currencyPair = currencyPair;
        this.timeFrame = timeFrame;
        this.recordCount = recordCount;
        this.initialRecordCount = initialRecordCount;
    }
}
