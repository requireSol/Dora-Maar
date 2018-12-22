import {
    frequencyConstants,
    precisionConstants,
    timeFrameConstants,
    orderBookTypeConstants,
    tradesTypeConstants,
    channelConstants,
    eventConstants
} from "../common/Constants.js";
import {isValueOfObject, toValueIfKeyOfObject} from "../common/utils/ObjectUtils.js";

class ClientRequest {
    constructor(currencyPair) {
        this.currencyPair = currencyPair;
    }

    get isValidCurrencyPair() {
        console.warn("not implemented for now");
    }

    get isValid() {
        console.warn("not implemented");
    }

    get validationInfo() {
        console.warn("not implemented");
    }

    convertToApiRequest() {
        console.warn("not implemented");
    }
}


export class OrderBookRequest extends ClientRequest {
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
        super(currencyPair);
        this.precision = toValueIfKeyOfObject(precision.toUpperCase(), precisionConstants);
        this.recordCount = recordCount;
        this.askOrBid = toValueIfKeyOfObject(askOrBid.toUpperCase(), orderBookTypeConstants);
        this.updateRate = toValueIfKeyOfObject(updateRate.toUpperCase(), frequencyConstants);
    }

    get isValidPrecision() {
        return isValueOfObject(this.precision, precisionConstants);
    }

    get isValidUpdateRate() {
        return isValueOfObject(this.updateRate, frequencyConstants);
    }

    get isValidAskOrBid() {
        return isValueOfObject(this.askOrBid, orderBookTypeConstants);
    }

    get isValidRecordCount() {
        return this.recordCount > 0 && this.recordCount <= 90;
    }

    get isValid() {
        return this.isValidPrecision && this.isValidRecordCount && this.isValidAskOrBid && this.isValidUpdateRate;
    }

    get validationInfo() {
        return {
            precision: this.isValidPrecision,
            recordCount: this.isValidRecordCount,
            askOrBid: this.isValidAskOrBid,
            updateRate: this.isValidUpdateRate,
        }
    }

    convertToApiRequest() {
        return {
            event: eventConstants.SUBSCRIBE,
            channel: channelConstants.ORDERBOOK,
            len: "100",
            freq: this.updateRate,
            prec: this.precision,
            symbol: "t" + this.currencyPair,
        };
    }
}

export class TickerRequest extends ClientRequest {
    /**
     * Object to request ticker data.
     * @param currencyPair the ticker's currency pair
     * @param recordCount the maximum number of records
     * @param initialRecordCount the maximum number of records of the first update
     * @constructor
     */
    constructor(currencyPair, recordCount, initialRecordCount) {
        super(currencyPair);
        this.recordCount = recordCount;
        this.initialRecordCount = initialRecordCount;
    }

    get isValidRecordCount() {
        return this.recordCount > 0 && this.recordCount <= 20;
    }

    get isValidInitialRecordCount() {
        return this.initialRecordCount > 0 && this.initialRecordCount <= 20;
    }

    get isValid() {
        this.isValidRecordCount && this.isValidInitialRecordCount;
    }

    get validationInfo() {
        return {
            recordCount: this.isValidRecordCount,
            initialRecordCount: this.isValidInitialRecordCount,
        }
    }

    convertToApiRequest() {
        return {
            event: eventConstants.SUBSCRIBE,
            channel: channelConstants.TICKER,
            symbol: "t" + this.currencyPair,
        };
    }
}

export class TradesRequest extends ClientRequest {
    /**
     * Object to request trades data.
     * @param currencyPair the trades' currency pair
     * @param recordCount the maximum number of records
     * @param soldOrBoughtOrBoth the type of entries, only sold, only bought or sold and both records
     * @param initialRecordCount the maximum number of records of the first update
     * @constructor
     */
    constructor(currencyPair, recordCount, soldOrBoughtOrBoth, initialRecordCount) {
        super(currencyPair);
        this.recordCount = recordCount;
        this.soldOrBoughtOrBoth = toValueIfKeyOfObject(soldOrBoughtOrBoth.toUpperCase(), tradesTypeConstants);
        this.initialRecordCount = initialRecordCount;
    }

    get isValidRecordCount() {
        return this.recordCount > 0 && this.recordCount <= 20;
    }

    get isValidInitialRecordCount() {
        return this.initialRecordCount > 0 && this.initialRecordCount <= 20;
    }

    get isValidSoldOrBoughtOrBoth() {
        return isValueOfObject(this.soldOrBoughtOrBoth, tradesTypeConstants);
    }

    get isValid() {
        return this.isValidInitialRecordCount && this.isValidRecordCount && this.isValidSoldOrBoughtOrBoth;
    }

    get validationInfo() {
        return {
            recordCount: this.isValidRecordCount,
            initialRecordCount: this.isValidInitialRecordCount,
            soldOrBoughtOrBoth: this.isValidSoldOrBoughtOrBoth,
        }
    }

    convertToApiRequest() {
        return {
            event: eventConstants.SUBSCRIBE,
            channel: channelConstants.TRADES,
            symbol: "t" + this.currencyPair,
        };
    }
}

export class CandlesRequest extends ClientRequest {
    /**
     * Object to request candles data.
     * @param currencyPair the candles' currency pair
     * @param timeFrame the time interval between two data points
     * @param recordCount the number of data points
     * @param initialRecordCount the number of data points of the first update
     * @constructor
     */
    constructor(currencyPair, timeFrame, recordCount, initialRecordCount) {
        super(currencyPair);
        this.timeFrame = toValueIfKeyOfObject(timeFrame, timeFrameConstants);
        this.recordCount = recordCount;
        this.initialRecordCount = initialRecordCount;
    }

    get isValidRecordCount() {
        return this.recordCount > 0 && this.recordCount <= 20;
    }

    get isValidInitialRecordCount() {
        return this.initialRecordCount > 0 && this.initialRecordCount <= 20;
    }

    get isValidTimeFrame() {
        return isValueOfObject(this.timeFrame, timeFrameConstants);
    }

    get isValid() {
        return this.isValidTimeFrame && this.isValidRecordCount && this.isValidInitialRecordCount;
    }

    get validationInfo() {
        return {
            timeFrame: this.isValidTimeFrame,
            recordCount: this.isValidRecordCount,
            initialRecordCount: this.isValidInitialRecordCount,
        }
    }

    convertToApiRequest() {
        return {
            event: eventConstants.SUBSCRIBE,
            channel: channelConstants.CANDLES,
            key: "trade:" + this.timeFrame + ":t" + this.currencyPair,
        }
    }
}
