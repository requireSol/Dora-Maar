export const platformConstants = {
    MAINTENANCE: 0,
    OPERATIVE: 1
};
export const channelConstants = {
    ORDERBOOK: "book",
    TICKER: "ticker",
    TRADES: "trades",
    CANDLES: "candles",
};
export const frequencyConstants = {
    REALTIME: "F0",
    EVERY_TWO_SECONDS: "F1",

};
export const tradesTypeConstants = {
    SOLD: "sold",
    BOUGHT: "bought",
    BOTH: "both"
};
export const eventConstants = {
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe",
    SUBSCRIBED: "subscribed",
    UNSUBSCRIBED: "unsubscribed",
    ERROR: "error",
    INFO: "info",
    PING: "ping",
    PONG: "pong"

};

export const orderBookTypeConstants = {
    ASK: "ask",
    BID: "bid"
};
export const precisionConstants = {
    TWO_SIGNIFICANT_DIGITS: "P3",
    THREE_SIGNIFICANT_DIGITS: "P2",
    FOUR_SIGNIFICANT_DIGITS: "P1",
    FIVE_SIGNIFICANT_DIGITS: "P0"
};
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

export const sentStatusConstants = {
    SENT: 0,
    OFFLINE: 1,
    NO_WEBSOCKET: 2,
    WEBSOCKET_NOT_OPEN: 3,
    PLATFORM_NOT_OPERATIVE : 4,

};
