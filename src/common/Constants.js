export const platformConstants = {
    MAINTENANCE: 0,
    OPERATIVE: 1
};

export function isValidPlatformStatus(status) {
    for (const value of Object.values(platformConstants)) {
        if (value === status) {
            return true;
        }
    }
    return false;
}

export const channelConstants = {
    ORDERBOOK: "book",
    TICKER: "ticker",
    TRADES: "trades",
    CANDLES: "candles",
};

export function isValidChannel(channel) {
    for (const value of Object.values(channelConstants)) {
        if (value === channel) {
            return true;
        }
    }
    return false;
}

export const frequencyConstants = {
    REALTIME: "F0",
    EVERY_TWO_SECONDS: "F1",

};

export function isValidFrequency(frequency) {
    for (const value of Object.values(frequencyConstants)) {
        if (value === frequency) {
            return true;
        }
    }
    return false;
}

export const precisionConstants = {
    TWO_SIGNIFICANT_DIGITS: "P3",
    THREE_SIGNIFICANT_DIGITS: "P2",
    FOUR_SIGNIFICANT_DIGITS: "P1",
    FIVE_SIGNIFICANT_DIGITS: "P0"
};

export function isValidPrecision(precision) {
    for (const value of Object.values(precisionConstants)) {
        if (value === precision) {
            return true;
        }
    }
    return false;
}

export const timeFrameConstants = {
    ONE_MINUTE: "1m",
    FIVE_MINUTES: "5m",
    FIFTEEN_MINUTES: "15m",
    HALF_HOR: "30m",
    ONE_HOUR: "1h",
    THREE_HOURS: "3h",
    SIX_HOURS: "6h",
    TWELVE_HOURS: "12h",
    ONE_DAY: "1D",
    SEVEN_DAYS: "7D",
    FOURTEEN_DAYS: "14D",
    ONE_MONTH: "1M"
};

export function isValidTimeFrame(timeFrame) {
    for (const value of Object.values(timeFrameConstants)) {
        if (value === timeFrame) {
            return true;
        }
    }
    return false;
}

