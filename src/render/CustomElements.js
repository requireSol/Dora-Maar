import {ObserverBaseElement} from "./BaseElement.js";
import {OrderBookRequest, TickerRequest, TradesRequest} from "../model/requests.js";
import {OrderBookData} from "../model/OrderBookData.js";
import {TradesData} from "../model/TradesData.js";
import {TickerData} from "../model/TickerData.js";
import {round} from "../common/utils/MathUtils.js";

export class OrderBookView extends ObserverBaseElement {
    static get observedAttributes() {
        return ["data-count", "data-pair", "data-askOrBid"];
    }

    constructor() {
        super();
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
        this.removeChild(this.table);
        this.removeChild(this.notificationBox);
    }

    connectedCallback() {
        super.connectedCallback();
        const request = this.createRequestFromAttributes();
        const title = "ORDERBOOK - " + request.askOrBid.toUpperCase() + " - " + request.currencyPair;
        this.table = document.createElement("div", {is: "order-book-table"});
        this.table.setSize(request.recordCount);
        this.table.setColumnNames(OrderBookData.getDataFields());
        this.table.setTitle(title);
        const round3 = (x) => round(x, 3);
        this.table.setColumnModifier([round3, round3, round3, null]);
        this.table.setColumnOrder([0, 1, 2, 3]);

        this.notificationBox = document.createElement("div", {is: "notification-box"});

        this.shadow.appendChild(this.table);
        this.shadow.appendChild(this.notificationBox);

        this.subscribeToData(request);

    }

    createRequestFromAttributes() {
        const askOrBid = this.getAttribute("data-askOrBid");
        const recordCount = parseInt(this.getAttribute("data-count"));
        const currencyPair = this.getAttribute("data-pair");
        return new OrderBookRequest("P0", recordCount, askOrBid, currencyPair, "realtime")
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
        return ["data-count", "data-pair", "data-soldOrBoughtOrBoth"];
    }

    constructor() {
        super();
    }

    disconnectedCallback() {
        this.unsubscribeFromData();
        this.removeChild(this.table);
        this.removeChild(this.notificationBox);
    }

    connectedCallback() {
        super.connectedCallback();
        const request = this.createRequestFromAttributes();
        const title = request.soldOrBoughtOrBoth.toUpperCase() + " - " + request.currencyPair;

        this.table = document.createElement("div", {is: "trades-table"});
        this.table.setSize(request.recordCount);
        this.table.setColumnNames(TradesData.getDataFields());
        this.table.setTitle(title);

        this.notificationBox = document.createElement("div", {is: "notification-box"});
        this.shadow.appendChild(this.table);
        this.shadow.appendChild(this.notificationBox);
        this.subscribeToData(request);
    }

    createRequestFromAttributes() {
        const currencyPair = this.getAttribute("data-pair");
        const recordCount = parseInt(this.getAttribute("data-count"));
        const soldOrBoughtOrBoth = this.getAttribute("data-soldOrBoughtOrBoth");
        return new TradesRequest(currencyPair, recordCount, soldOrBoughtOrBoth, recordCount);
    }

    update(data, metadata) {
        this.table.fillTable(data, metadata);
    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }
}

export class TickerView extends ObserverBaseElement {
    /*static get observedAttributes() {
        return ["data-count", "data-pair"];
    }*/

    constructor() {
        super();
    }

    disconnectedCallback() {
        //this.classList.remove("wrapper");
        this.unsubscribeFromData();
        this.removeChild(this.table);
        this.removeChild(this.notificationBox);
    }

    connectedCallback() {
        this.classList.add("wrapper");
        const request = this.createRequestFromAttributes();
        const title = "TICKER - " + request.currencyPair;

        this.table = document.createElement("div", {is: "trades-table"});
        this.table.setSize(request.recordCount);
        this.table.setColumnNames(TickerData.getDataFields());
        this.table.setTitle(title);

        this.notificationBox = document.createElement("div", {is: "notification-box"});
        this.shadow.appendChild(this.table);
        this.shadow.appendChild(this.notificationBox);
        this.subscribeToData(request);

    }

    createRequestFromAttributes() {
        const currencyPair = this.getAttribute("data-pair");
        const recordCount = parseInt(this.getAttribute("data-count"));
        return new TickerRequest(currencyPair, recordCount, recordCount);
    }

    update(data, metadata) {
        this.table.fillTable(data, metadata);
    }

    info(message) {
        this.notificationBox.addNotification(message["level"], message["title"], message["msg"]);
    }

    /*attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "data-pair":
                // unsubscribe and subscribe to new value
                console.log(name + " " + oldValue + " -> " + newValue);
                // this.table.unsubscribeFromData();
                // this.table.clientRequest.currencyPair = newValue;
                // this.table.subscribeToData(this.table.clientRequest);
                break;

            case "data-count":
                // maybe soft solution is possible
                console.log(name + " " + oldValue + " -> " + newValue);
                break;

        }
    }*/
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
        notification.setAttribute("data-level", level);
        notification.setAttribute("data-title", title);
        notification.setAttribute("data-message", message);
        notification.setAttribute("data-timeout", "" + timeout);
        notification.setAttribute("data-isVolatile", "" + isVolatile);
        notification.setAttribute("data-isReplaceable", "" + isReplaceable);
        notification.setAttribute("data-minimumTimeout", "" + minimumTimeout);

        if (this.allMessages.length === this.getMaxCount()) {
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

    getMaxCount() {
        let maxCount = parseInt(this.getAttribute("data-maxCount"));
        if (isNaN(maxCount)) {
            maxCount = 4;
        }
        return maxCount;
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
        this.classList.add(this.getLevel());
        // update title
        this.notificationTitle.textContent = this.getTitle();
        // update message
        this.notificationBody.textContent = this.getMessage();
    }

    applyTimeouts() {
        clearTimeout(this.closeMinimumTimeout);
        clearTimeout(this.closeTimeout);

        const notification = this;
        const parent = this.parentElement;

        if (this.isVolatile()) {
            const timeout = this.getTimeout();
            if (timeout >= 0) {
                this.closeTimeout = setTimeout(function () {
                    notification.closeButton.onclick(null);
                }, timeout);
            }
        }
        if (this.isReplaceable()) {
            const minimumTimeout = this.getMinimumTimeout();
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

    getLevel() {
        let level = this.getAttribute("data-level");
        if (!["success", "info", "warn", "error"].includes(level)) {
            level = "error";
        }
        return level;
    }

    getTitle() {
        let title = "Unknown";
        if (this.hasAttribute("data-title")) {
            title = this.getAttribute("data-title");
        }
        return title;
    }

    getMessage() {
        let message = "Unknown Error";
        if (this.hasAttribute("data-title")) {
            message = this.getAttribute("data-message");
        }
        return message;
    }

    getTimeout() {
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

    isVolatile() {
        let isVolatile = this.getAttribute("data-isVolatile");
        return isVolatile !== "false";
    }

    getMinimumTimeout() {
        let minimumTimeout = parseInt(this.getAttribute("data-minimumTimeout"));
        if (isNaN(minimumTimeout)) {
            minimumTimeout = 5000;
        }
        return minimumTimeout;
    }

    isReplaceable() {
        let isReplaceable = this.getAttribute("data-isReplaceable");
        return isReplaceable !== "false";
    }

}