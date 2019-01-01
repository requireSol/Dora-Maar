import {ObserverBaseElement} from "./BaseElement.js";
import {OrderBookRequest, TickerRequest, TradesRequest} from "../model/requests.js";
import {OrderBookData} from "../model/OrderBookData.js";
import {TradesData} from "../model/TradesData.js";
import {TickerData} from "../model/TickerData.js";
import {round} from "../common/utils/MathUtils.js";
import {frequencyConstants, orderBookTypeConstants, precisionConstants, tradesTypeConstants} from "../common/Constants.js";
import {CandlesRequest} from "../model/requests.js";

const isInitializedProperty = Symbol();

export class CandlesView extends ObserverBaseElement {
    static get observedAttributes() {
        return ["data-count", "data-pair", "data-title", "data-timeFrame", "data-action", "data-width", "data-height"];
    }

    set count(recordCount) {
        this.setAttribute("data-count", "" + recordCount);
    }

    set pair(currencyPair) {
        this.setAttribute("data-pair", currencyPair);
    }

    set title(title) {
        this.setAttribute("data-title", title);
    }

    set timeFrame(timeFrame) {
        this.setAttribute("data-timeFrame", timeFrame);
    }

    set width(width) {
        this.setAttribute("data-width", width);
    }

    set height(height) {
        this.setAttribute("data-height", height);
    }

    get count() {
        let recordCount = parseInt(this.getAttribute("data-count"));
        if (isNaN(recordCount)) {
            recordCount = 50;
        }
        return recordCount;
    }

    get title() {
        let title = this.getAttribute("data-title");
        if (title === null) {
            title = "CANDLECHART - " + this.pair.toUpperCase() + " - " + this.timeFrame;
        }
        return title;
    }

    get timeFrame() {
        let timeFrame = this.getAttribute("data-timeFrame");
        if (timeFrame === null) {
            timeFrame = "1m";
        }
        return timeFrame;
    }

    get width() {
        let width = parseInt(this.getAttribute("data-width"));
        if (isNaN(width)) {
            width = 400;
        }
        return width;
    }

    get height() {
        let height = parseInt(this.getAttribute("data-height"));
        if (isNaN(height)) {
            height = 300;
        }
        return height;
    }

    get pair() {
        let pair = this.getAttribute("data-pair");
        if (pair === null) {
            pair = "BTCUSD";
        }
        return pair;
    }



    constructor() {
        super();
        this.parameterBackup = new Map();
        this[isInitializedProperty] = false;
        this.chart = null;
        this.notificationBox = null;
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this[isInitializedProperty]) {
            // create chart
            this.chart = document.createElement("div", {is: "candle-chart"});
            this.chart.width = this.width;
            this.chart.height = this.height;
            this.chart._dataCount = this.count;
            this.chart._title = this.title;
            // create notification box
            this.notificationBox = document.createElement("div", {is: "notification-box"});

            this.shadow.appendChild(this.chart);
            this.shadow.appendChild(this.notificationBox);
            this[isInitializedProperty] = true;
        }
        this.applyAttributes(true);
    }

    applyAttributes(assumeEverythingChanged = false) {
        if (this.parameterBackup.has("data-title") || assumeEverythingChanged) {
            //this.chart.title = this.title; // TODO
        }
        if (this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            this.chart.dataCount = this.count; // TODO

        }
        if (this.parameterBackup.has("data-pair") || this.parameterBackup.has("data-count")
            || assumeEverythingChanged) {
            // need new request
            //this.chart.clear(); // TODO
            this.subscribeToData(this.createRequestFromAttributes());
        }
    }

    restoreParameters() {
        for (const [name, value] of this.parameterBackup.entries()) {
            this.setAttribute(name, value);
        }
        this.parameterBackup.clear();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-action") {
            if (newValue === "restore") {
                this.restoreParameters();
            } else if (newValue === "apply") {
                this.applyAttributes();
            }
        } else if (!this.parameterBackup.has(name)) {
            this.parameterBackup.set(name, oldValue);
        }
    }

    createRequestFromAttributes() {
        return new CandlesRequest(this.pair, this.timeFrame, this.count, this.count)
    }

    update(data, metadata) {
        this.chart.update(data, metadata);

    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }




}


export class OrderBookView extends ObserverBaseElement {
    static get observedAttributes() {
        return ["data-count", "data-pair", "data-askOrBid", "data-title", "data-frequency", "data-precision", "data-action"];
    }

    constructor() {
        super();
        this.parameterBackup = new Map();
        this[isInitializedProperty] = false;
        this.table = null;
        this.notificationBox = null;
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this[isInitializedProperty]) {
            // create table
            this.table = document.createElement("div", {is: "order-book-table"});
            this.table._columnNames = OrderBookData.getDataFields();
            const round3 = (x) => round(x, 3);
            this.table._columnModifier = [round3, round3, round3, null];
            this.table._columnOrder = [0, 1, 2, 3];
            // create notification box
            this.notificationBox = document.createElement("div", {is: "notification-box"});

            this.shadow.appendChild(this.table);
            this.shadow.appendChild(this.notificationBox);
            this[isInitializedProperty] = true;
        }
        this.applyAttributes(true);
    }

    applyAttributes(assumeEverythingChanged = false) {
        if (this.parameterBackup.has("data-title") || assumeEverythingChanged) {
            this.table.title = this.title;
        }
        if (this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            this.table.rowCount = this.count;
            //this.table.applyRowCount();
        }
        if (this.parameterBackup.has("data-askOrBid") || this.parameterBackup.has("data-pair")
            || this.parameterBackup.has("data-frequency") || this.parameterBackup.has("data-precision")
            || this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            // need new request
            this.table.setAllCellsToPlaceholder();
            this.subscribeToData(this.createRequestFromAttributes());
        }
    }

    set askOrBid(askOrBid) {
        this.setAttribute("data-askOrBid", askOrBid);
    }

    set count(recordCount) {
        this.setAttribute("data-count", "" + recordCount);
    }

    set pair(currencyPair) {
        this.setAttribute("data-pair", currencyPair);
    }

    set frequency(frequency) {
        this.setAttribute("data-frequency", frequency);
    }

    set precision(precision) {
        this.setAttribute("data-precision", precision);
    }

    set title(title) {
        this.setAttribute("data-title", title);
    }

    get askOrBid() {
        let askOrBid = this.getAttribute("data-askOrBid");
        if (askOrBid === null) {
            askOrBid = orderBookTypeConstants.ASK;
        }
        return askOrBid
    }

    get count() {
        let recordCount = parseInt(this.getAttribute("data-count"));
        if (isNaN(recordCount)) {
            recordCount = 10;
        }
        return recordCount;
    }

    get pair() {
        let pair = this.getAttribute("data-pair");
        if (pair === null) {
            pair = "BTCUSD";
        }
        return pair;
    }

    get frequency() {
        let frequency =  this.getAttribute("data-frequency");
        if (frequency === null) {
            frequency = frequencyConstants.EVERY_TWO_SECONDS;
        }
        return frequency;
    }

    get precision() {
        let precision = this.getAttribute("data-precision");
        if (precision === null) {
            precision = precisionConstants.FIVE_SIGNIFICANT_DIGITS;
        }
        return precision;
    }

    get title() {
        let title = this.getAttribute("data-title");
        if (!this.hasAttribute(title)) {
            title = "ORDERBOOK - " + this.askOrBid.toUpperCase() + " - " + this.pair;
        }
        return title;
    }

    restoreParameters() {
        for (const [name, value] of this.parameterBackup.entries()) {
            this.setAttribute(name, value);
        }
        this.parameterBackup.clear();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-action") {
            if (newValue === "restore") {
                this.restoreParameters();
            } else if (newValue === "apply") {
                this.applyAttributes();
            }
        } else if (!this.parameterBackup.has(name)) {
            this.parameterBackup.set(name, oldValue);
        }
    }


    createRequestFromAttributes() {
        return new OrderBookRequest("P0", this.count, this.askOrBid, this.pair, this.frequency)
    }

    update(data, metadata) {
        this.table.fillTable(data, metadata);
    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }
}

export class TradesView extends ObserverBaseElement {
    static get observedAttributes() {
        return ["data-count", "data-pair", "data-soldOrBoughtOrBoth", "data-pair", "data-action"];
    }

    constructor() {
        super();
        this.parameterBackup = new Map();
        this[isInitializedProperty] = false;
        this.table = null;
        this.notificationBox = null;
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this[isInitializedProperty]) {
            // create table
            this.table = document.createElement("div", {is: "trades-table"});
            this.table._columnNames = TradesData.getDataFields();
            this.table._columnModifier = [null, null, null, null];
            this.table._columnOrder = [0, 1, 2, 3];
            // create notification box
            this.notificationBox = document.createElement("div", {is: "notification-box"});
            this.shadow.appendChild(this.table);
            this.shadow.appendChild(this.notificationBox);
        }
        this.applyAttributes(true);

    }

    applyAttributes(assumeEverythingChanged = false) {
        if (this.parameterBackup.has("data-title") || assumeEverythingChanged) {
            this.table.title = this.title;
        }
        if (this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            this.table.rowCount = this.count;
            //this.table.applyRowCount();
        }
        if (this.parameterBackup.has("data-soldOrBoughtOrBoth") || this.parameterBackup.has("data-pair")
            || this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            // need new request
            this.table.setAllCellsToPlaceholder();
            this.subscribeToData(this.createRequestFromAttributes());
        }
    }

    restoreParameters() {
        for (const [name, value] of this.parameterBackup.entries()) {
            this.setAttribute(name, value);
        }
        this.parameterBackup.clear();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-action") {
            if (newValue === "restore") {
                this.restoreParameters();
            } else if (newValue === "apply") {
                this.applyAttributes();
            }
        } else if (!this.parameterBackup.has(name)) {
            this.parameterBackup.set(name, oldValue);
        }
    }

    set title(title) {
        this.setAttribute("data-title", title);
    }

    set soldOrBoughtOrBoth(askOrBid) {
        this.setAttribute("data-soldOrBoughtOrBoth", askOrBid);
    }

    set count(recordCount) {
        this.setAttribute("data-count", "" + recordCount);
    }

    set pair(currencyPair) {
        this.setAttribute("data-pair", currencyPair);
    }

    get soldOrBoughtOrBoth() {
        let soldOrBoughtOrBoth = this.getAttribute("data-soldOrBoughtOrBoth");
        if (soldOrBoughtOrBoth === null) {
            soldOrBoughtOrBoth = tradesTypeConstants.BOTH;
        }
        return soldOrBoughtOrBoth;
    }


    get title() {
        let title = this.getAttribute("data-title");
        if (title === null) {
            title = "TRADES - " + this.soldOrBoughtOrBoth.toUpperCase() + " - " + this.pair;
        }
        return title;
    }

    get pair() {
        let pair = this.getAttribute("data-pair");
        if (pair === null) {
            pair = "BTCUSD";
        }
        return pair;
    }

    get count() {
        let recordCount = parseInt(this.getAttribute("data-count"));
        if (isNaN(recordCount)) {
            recordCount = 10;
        }
        return recordCount;
    }

    createRequestFromAttributes() {
        return new TradesRequest(this.pair, this.count, this.soldOrBoughtOrBoth, this.count);
    }

    update(data, metadata) {
        this.table.fillTable(data, metadata);
    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }
}

export class TickerView extends ObserverBaseElement {
    static get observedAttributes() {
        return ["data-count", "data-pair", "data-title", "data-action"];
    }

    constructor() {
        super();
        this.parameterBackup = new Map();
        this[isInitializedProperty] = false;
        this.table = null;
        this.notificationBox = null;
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this[isInitializedProperty]) {
            // create table
            this.table = document.createElement("div", {is: "ticker-table"});
            this.table._columnNames = TickerData.getDataFields();
            const round3 = (x) => round(x, 3);
            this.table._columnModifier = [null, round3, null, round3, null, null, null, round3, null, null, null];
            this.table._columnOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            // create notification box
            this.notificationBox = document.createElement("div", {is: "notification-box"});
            this.shadow.appendChild(this.table);
            this.shadow.appendChild(this.notificationBox);
        }
        this.applyAttributes(true);
        //const title = "TICKER - " + request.currencyPair;

    }

    set title(title) {
        this.setAttribute("data-title", title);
    }

    set count(recordCount) {
        this.setAttribute("data-count", "" + recordCount);
    }

    set pair(currencyPair) {
        this.setAttribute("data-pair", currencyPair);
    }

    get title() {
        let title = this.getAttribute("data-title");
        if (title === null) {
            title = "TICKER - " + this.pair;
        }
        return title;
    }

    get pair() {
        let pair = this.getAttribute("data-pair");
        if (pair === null) {
            pair = "BTCUSD";
        }
        return pair;
    }

    get count() {
        let recordCount = parseInt(this.getAttribute("data-count"));
        if (isNaN(recordCount)) {
            recordCount = 10;
        }
        return recordCount;
    }

    createRequestFromAttributes() {
        return new TickerRequest(this.pair, this.count, this.count);
    }

    applyAttributes(assumeEverythingChanged = false) {
        if (this.parameterBackup.has("data-title") || assumeEverythingChanged) {
            this.table.title = this.title;
        }
        if (this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            this.table.rowCount = this.count;
        }
        if (this.parameterBackup.has("data-pair") || this.parameterBackup.has("data-count") || assumeEverythingChanged) {
            // need new request
            this.table.setAllCellsToPlaceholder();
            this.subscribeToData(this.createRequestFromAttributes());
        }
    }

    restoreParameters() {
        for (const [name, value] of this.parameterBackup.entries()) {
            this.setAttribute(name, value);
        }
        this.parameterBackup.clear();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-action") {
            if (newValue === "restore") {
                this.restoreParameters();
            } else if (newValue === "apply") {
                this.applyAttributes();
            }
        } else if (!this.parameterBackup.has(name)) {
            this.parameterBackup.set(name, oldValue);
        }
    }

    update(data, metadata) {
        this.table.fillTable(data, metadata);
    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }


}

export class NotificationBox extends HTMLDivElement {
    constructor() {
        super();
        this.isInitialized = false;
        this.replaceableMessages = [];
        this.allMessages = [];
    }

    connectedCallback() {
        if (!this.isInitialized) {
            const style = document.createElement("style");
            style.innerText =
                `.notification-box {
            position: absolute;
            top: 0;
            display: flex;
            justify-content: flex-end;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }
    .notification {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding-left: 20px;
            padding-bottom: 8px;
            background-color: white;
            color: black;
            opacity: 1;
            transition: opacity 0.6s;
            pointer-events: all;
        }

    .notification.success {
            background-color: #a0ffa0;
            border-left: 6px solid #4CAF50;
        }

    .notification.info {
            background-color: #a3c2fe;
            border-left: 6px solid #2196F3;
        }

    .notification.warn {
            background-color: #ffffcc;
            border-left: 6px solid #ffeb3b;
        }

    .notification.error {
            background-color: #ffa0a0;
            border-left: 6px solid #f44336;
        }

    .notification-title {
            padding: 8px 0 0;
            margin: 0;
        }

    .notification-text {
            padding: 4px 0 0;
            margin: 0;
        }

    .close-button {
            font-size: 18px;
            position: absolute;
            top: 0;
            right: 0;
            user-select: none;
            padding: 8px 16px;
            cursor: pointer;
        }

    .close-button:hover {
            color: #000;
            background-color: #ccc;
        }`;
            this.appendChild(style);
            this.classList.add("notification-box");
        }
    }

    addNotification(level, title, message = "", isVolatile = true, timeout = 15000, isReplaceable = true, minimumTimeout = 5000) {
        const notification = document.createElement("div", {is: "notification-msg"});
        notification.level = level;
        notification.title = title;
        notification.message = message;
        notification.timeout = timeout;
        notification.isVolatile = isVolatile;
        notification.isReplaceable = isReplaceable;
        notification.minimumTimeout = minimumTimeout;
        while (this.allMessages.length >= this.maxCount) {
            this.closeOldestMessage();
        }

        for (const message of this.allMessages) {
            message.isReplaceRequested = true;
        }

        this.allMessages.push(notification);
        this.appendChild(notification);
    }

    closeReplaceableMessages() {
        for (let i = this.replaceableMessages.length - 1; i >= 0; i--) {
            this.replaceableMessages[i].closeButton.onclick(null);
        }
    }

    removeMessage(notification) {
        for (let i = this.allMessages.length - 1; i >= 0; i--) {
            if (i < this.replaceableMessages && this.replaceableMessages[i] === notification) {
                this.replaceableMessages.splice(i, 1);
                break;
            }
            if (this.allMessages[i] === notification) {
                this.allMessages.splice(i, 1);
                break;
            }
        }
    }

    closeOldestMessage() {
        const oldestMessage = this.allMessages.shift();
        oldestMessage.closeButton.onclick(null);
    }

    markMessageAsReplaceable(notification) {
        if (notification.isConnected) {
            this.replaceableMessages.push(notification);
        }
    }

    get maxCount() {
        let maxCount = parseInt(this.getAttribute("data-maxCount"));
        if (isNaN(maxCount)) {
            maxCount = 4;
        }
        return maxCount;
    }

    set maxCount(maxCount) {
        this.setAttribute("data-maxCount", "" + maxCount);
    }
}

export class NotificationMessage extends HTMLDivElement {
    constructor() {
        super();
        //const shadow = this.attachShadow({mode: "open"});
        this.isShadowDOMInitialized = false;
        this.closeTimeout = null;
        this.closeMinimumTimeout = null;
        this.isReplaceRequested = false;
    }

    applyAttributes() {
        // update level
        this.classList.remove("success", "info", "warn", "error");
        this.classList.add(this.level);
        // update title
        this.notificationTitle.textContent = this.title;
        // update message
        this.notificationBody.textContent = this.message;
    }

    applyTimeouts() {
        clearTimeout(this.closeMinimumTimeout);
        clearTimeout(this.closeTimeout);

        const notification = this;
        const parent = this.parentElement;

        if (this.isVolatile) {
            const timeout = this.timeout;
            if (timeout >= 0) {
                this.closeTimeout = setTimeout(function () {
                    notification.closeButton.onclick(null);
                }, timeout);
            }
        }
        if (this.isReplaceable) {
            const minimumTimeout = this.minimumTimeout;
            if (minimumTimeout >= 0) {
                this.closeMinimumTimeout = setTimeout(function () {
                    if (this.isReplaceRequested) {
                        notification.closeButton.onclick(null);
                    } else {
                        parent.markMessageAsReplaceable(this);
                    }
                }, minimumTimeout);
            } else {
                parent.markMessageAsReplaceable(this);
            }
        }
    }

    connectedCallback() {
        const notification = this;
        const parent = this.parentElement;

        if (!this.isShadowDOMInitialized) {
            this.classList.add("notification");

            // build close button
            this.closeButton = document.createElement("span");
            this.closeButton.classList.add("close-button");
            this.closeButton.onclick = function () {
                if (!notification.isConnected) {
                    return;
                }

                clearTimeout(notification.closeMinimumTimeout);
                clearTimeout(notification.closeTimeout);
                notification.closeTimeout = null;
                notification.closeMinimumTimeout = null;

                parent.removeMessage(this);
                notification.remove();
            };
            this.closeButton.innerHTML = "&times";
            this.appendChild(this.closeButton);
            // build title
            this.notificationTitle = document.createElement("p");
            this.notificationTitle.classList.add("notification-title");
            this.appendChild(this.notificationTitle);
            // build body
            this.notificationBody = document.createElement("p");
            this.notificationBody.classList.add("notification-text");
            this.appendChild(this.notificationBody);

            this.isShadowDOMInitialized = true;
        }
        this.applyAttributes();

        parent.closeReplaceableMessages();

        this.applyTimeouts();
    }

    set level(level) {
        this.setAttribute("data-level", level);
    }

    set message(message) {
        this.setAttribute("data-message", message);
    }

    set title(title) {
        this.setAttribute("data-title", title);
    }

    set timeout(timeout) {
        this.setAttribute("data-timeout", timeout);
    }

    set minimumTimeout(minimumTimeout) {
        this.setAttribute("data-minimumTimeout", minimumTimeout);
    }

    set isVolatile(isVolatile) {
        this.setAttribute("data-isVolatile", isVolatile);
    }

    set isReplaceable(isReplaceable) {
        this.setAttribute("data-isReplaceable", isReplaceable);
    }

    get level() {
        let level = this.getAttribute("data-level");
        if (!["success", "info", "warn", "error"].includes(level)) {
            level = "error";
        }
        return level;
    }

    get title() {
        let title = this.getAttribute("data-title");
        if (title === null) {
            title = "Unknown"
    }
        return title;
    }

    get message() {
        let message = "Unknown Error";
        if (this.hasAttribute("data-title")) {
            message = this.getAttribute("data-message");
        }
        return message;
    }

    get timeout() {
        let timeout = parseInt(this.getAttribute("data-timeout"));
        let minimumTimeout = parseInt(this.getAttribute("data-minimumTimeout"));

        if (!isNaN(minimumTimeout) && !isNaN(timeout)) {
            return Math.max(minimumTimeout, timeout);
        }
        if (isNaN(timeout)) {
            return -1;
        } else {
            return timeout;
        }
    }

    get isVolatile() {
        let isVolatile = this.getAttribute("data-isVolatile");
        return isVolatile !== "false";
    }

    get minimumTimeout() {
        let minimumTimeout = parseInt(this.getAttribute("data-minimumTimeout"));
        if (isNaN(minimumTimeout)) {
            minimumTimeout = 5000;
        }
        return minimumTimeout;
    }

    get isReplaceable() {
        let isReplaceable = this.getAttribute("data-isReplaceable");
        return isReplaceable !== "false";
    }

}