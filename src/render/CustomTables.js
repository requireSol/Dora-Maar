import {BaseTable} from "./BaseTable.js";

export class OrderBookTable extends BaseTable {
    constructor() {
        super();
    }

    fillTable(data, metadata) {
        for (let i = 0; i < this._rowCount && i < data.length; i++) {
            const newPrice = data[i][3];
            this.fillRow(i, data[i], metadata.has(newPrice));
        }
    }
}


export class TradesTable extends BaseTable {
    constructor(size, columnNames, parentNode, title) {
        super(size, columnNames, parentNode, title);
    }

    fillTable(data, metadata) {
        for (let i = 0; i < this._rowCount && i < data.length; i++) {
            this.fillRow(i, data[i], i === 1);
        }
    }
}


export class TickerTable extends BaseTable {
    constructor(size, columnNames, parentNode, title) {
        super(size, columnNames, parentNode, title);
    }

    fillTable(data, metadata) {
        for (let i = 0; i < this._rowCount && i < data.length; i++) {
            this.fillRow(i, data[i], i === 1);
        }
    }
}