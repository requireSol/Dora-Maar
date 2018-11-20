const isInitializedProperty = Symbol();

export class BaseTable extends HTMLDivElement {
    constructor() {
        super();
        this[isInitializedProperty] = false;

        this._showColumnHeader = true;
        this._showTitle = true;
        this._columnModifier = [];
        this._columnNames = [];
        this._columnOrder = [];
        this._title = "";
        this._rowCount = 10;

        this._underlyingData = null;
    }

    connectedCallback() {
        if (!this[isInitializedProperty]) {
            const style = document.createElement("style");
            style.innerText = `
.table {
    display: table;
}

.table-caption {
    display: table-caption;
    background: #f6f6f6;
    text-align: center;
    padding: 7px 20px;
}

.row {
    display: table-row;
    background: #f6f6f6;
}

.row:nth-of-type(odd) {
    background: #e9e9e9;
}

.row:nth-of-type(even) {
    background: #f6f6f6;
}

.row.header {
    font-weight: 900;
    color: #ffffff;
    background: #000000;
}

.cell {
    padding: 6px 12px;
    width: 100px;
    max-width: 100px;
    display: table-cell;
}

@keyframes highlight-effect {
    from {
        background-color: yellow;
    }
    to {
        opacity: 100;
    }
}

.change {
    animation-name: highlight-effect;
    animation-duration: 1s;

}`;
            this.appendChild(style);
            this.classList.add("table");

            this.titleDOM = null;
            this.headerDOM = null;
            this.rowsDOM = [];
            this.cellsDOM = [];

            this.title = this._title;
            this.showTitle = this._showTitle;
            this.columnNames = this._columnNames;
            this.showColumnHeader = this._showColumnHeader;
            this.rowCount = this._rowCount;


            this[isInitializedProperty] = true;
        }
    }

    hideColumn(indexOrColumnName) {
        if (typeof indexOrColumnName === "string") {
            indexOrColumnName = this._columnOrder.indexOf(this._columnNames.indexOf(indexOrColumnName));
        }
        for (const row of this.cellsDOM) {
            row[indexOrColumnName].style.display = "none";
        }
    }

    showColumn(indexOrColumnName) {
        if (typeof indexOrColumnName === "string") {
            indexOrColumnName = this._columnOrder.indexOf(this._columnNames.indexOf(indexOrColumnName));
        }
        for (const row of this.cellsDOM) {
            row[indexOrColumnName].style.display = "table-cell";
        }
    }

    get showTitle() {
        return this._showTitle;
    }

    get showColumnHeader() {
        return this._showColumnHeader;
    }

    get columnNames() {
        return this._columnNames;
    }

    get columnModifier() {
        return this._columnModifier;
    }

    get rowCount() {
        return this._rowCount;
    }

    get columnOrder() {
        return this._columnOrder;
    }

    get title() {
        return this._title;
    }

    set showTitle(showTitle) {
        this._showTitle = showTitle;
        if (this.titleDOM !== null) {
            this.titleDOM.style.display = showTitle ? "table-caption" : "none";
        }
    }

    set columnModifier(columnModifier) {
        this._columnModifier = columnModifier;
        if (this._underlyingData !== null) {
            this.fillTable(this._underlyingData)
        }
    }

    set columnOrder(columnOrder) {
        this._columnOrder = columnOrder;
        if (this._underlyingData !== null) {
            this.fillTable(this._underlyingData, null);
        }
        this.columnNames = this._columnNames;
    }

    set showColumnHeader(showColumnHeader) {
        this._showTitle = showColumnHeader;
        if (this.headerDOM !== null) {
            this.headerDOM.style.display = showColumnHeader ? "table-row" : "none";
        }
    }

    set rowCount(count) {
        this._rowCount = count;

        const currentCount = this.rowsDOM.length;
        if (count < currentCount) {
            for (let i = count; i < currentCount; i++) {
                this.removeChild(this.rowsDOM[i]);
            }
            this.rowsDOM.splice(count, currentCount - count);
            this.cellsDOM.splice(count, currentCount - count);
        }

        if (count > currentCount) {
            for (let i = 0; i < count - currentCount; i++) {
                this.addRow();
            }
        }
    }

    setAllCellsToPlaceholder(includeColumnHeaders = false, includeTitle = false, placeholder = "-") {
        if (includeTitle) {
            this.titleDOM.textContent = placeholder;
        }
        if (includeColumnHeaders) {
            this.headerDOM.textContent = placeholder;
        }
        for (const row of this.cellsDOM) {
            for (const cell of row) {
                cell.textContent = placeholder;
            }
        }
    }

    static getCell(defaultValue = "-") {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = defaultValue;
        return cell;
    }

    addRow() {
        const rowDOM = document.createElement("div");
        rowDOM.classList.add("row");

        const internalRow = [];
        for (let i = 0; i < this._columnOrder.length; i++) {
            const newCell = BaseTable.getCell();
            internalRow.push(newCell);
            rowDOM.appendChild(newCell);
        }

        this.cellsDOM.push(internalRow);
        this.rowsDOM.push(rowDOM);

        this.appendChild(rowDOM);
    }

    set columnNames(columnNames) {
        this._columnNames = columnNames;
        if (this.headerDOM === null) {
            const rowDOM = document.createElement("div");
            rowDOM.classList.add("row");
            rowDOM.classList.add("header");
            for (const columnIndex of this._columnOrder) {
                const newCell = BaseTable.getCell(this._columnNames[columnIndex]);
                rowDOM.appendChild(newCell);
            }
            this.headerDOM = rowDOM;
            this.appendChild(rowDOM);
        } else {
            for (let i = 0; i < this.headerDOM.length; i++) {
                this.headerDOM[i].textContent = this._columnNames[this._columnOrder[i]];
            }
        }
    }

    set title(title) {
        this._title = title;

        if (this.titleDOM === null) {
            const titleDOM = document.createElement("div");
            titleDOM.classList.add("table-caption");
            titleDOM.textContent = title;
            this.titleDOM = titleDOM;
            this.appendChild(titleDOM);
        } else {
            this.titleDOM.textContent = title;
        }
    }

    fillRow(index, rowData, changeAnimation = false) {
        const row = this.cellsDOM[index];
        for (let i = 0; i < this._columnOrder.length; i++) {
            if (changeAnimation) {
                row[i].classList.remove("change");
                void row[i].offsetWidth;
                row[i].classList.add("change");
            }
            //console.log(this);
            const dataIndex = this._columnOrder[i];
            const func = this._columnModifier[dataIndex];

            let newContent = rowData[dataIndex];
            if (func instanceof Function) {
                newContent = func(newContent);
            }
            row[i].textContent = newContent;
        }
    }

    fillTable(data, metadata) {
        this._underlyingData = data;
        for (let i = 1; i < this._rowCount + 1 && i < data.length; i++) {
            this.fillRow(i, data[i]);
        }
    }
}