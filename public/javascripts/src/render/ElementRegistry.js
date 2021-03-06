import {NotificationBox, NotificationMessage, OrderBookView, TickerView, TradesView} from "./CustomElements.js";
import {OrderBookTable, TickerTable, TradesTable} from "./CustomTables.js";
import {CandlesView} from "./CustomElements.js";
import {Chart} from "./BaseChart.js";

export function registerElements() {
    customElements.define("notification-box", NotificationBox, {extends: "div"});
    customElements.define("notification-msg", NotificationMessage, {extends: "div"});
    customElements.define("order-book-table", OrderBookTable, {extends: "div"});
    customElements.define("trades-table", TradesTable, {extends: "div"});
    customElements.define("ticker-table", TickerTable, {extends: "div"});
    customElements.define("candle-chart", Chart, {extends: "div"});
    customElements.define("order-book-view", OrderBookView);
    customElements.define("trades-view", TradesView);
    customElements.define("ticker-view", TickerView);
    customElements.define("candles-view", CandlesView);

}