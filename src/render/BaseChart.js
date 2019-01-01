import {round} from "../common/utils/MathUtils.js";

const isInitializedProperty = Symbol();

export class Chart extends HTMLDivElement {
    connectedCallback() {
        this.shadow = this.attachShadow({mode: "open"});
        this._chartWidth = this._width;
    }

    set title(title) {
        this._title = title;
        this.titleDiv.textContent = title;
    }

    set dataCount(dataCount) {
        this._dataCount = dataCount;
        if (this[isInitializedProperty]) {
            this.draw();
        }
    }

    set width(width) {
        this._width = width;
        if (this[isInitializedProperty]) {
            this.draw();
        }
    }

    set height(height) {
        this._height = height - this.params.SCROLLBAR_HEIGHT - this.params.TITLE_HEIGHT;
        if (this[isInitializedProperty]) {
            this.draw();
        }

        //this.draw();
    }

    set isXAxisDescending(isXAxisDescending) {
        this._isXAxisDescending = isXAxisDescending;
        this.updateOrInitData(this.data);
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get title() {
        return this._title;
    }

    get dataCount() {
        return this._dataCount;
    }

    get isXAxisDescending() {
        return this._isXAxisDescending;
    }

    constructor() {
        super();
        this.styles = null;
        this.xAxis = null;
        this.yAxis = null;
        this.minY = 0;
        this.maxY = 10;
        this.maxTicksY = 10;
        this._dataCount = 100;
        this._isXAxisDescending = true;

        this._chartWidth = this._width;
        this._height = 300;
        this._width = 400;


        this.xCoords = [];
        this.maxTextWidthYLabels = 35;
        this.maxTextWidthXLabels = 30;

        this.params = {
            GRAPH_LEFT_PADDING: 5,
            GRAPH_RIGHT_PADDING: 15,
            GRAPH_TOP_PADDING: 5,
            GRAPH_BOTTOM_PADDING: 5,
            Y_LABEL_RIGHT_PADDING: 5,
            X_LABEL_TOP_PADDING: 5,
            X_AXIS_MARKER_LENGTH: 5,
            Y_AXIS_MARKER_LENGTH: 5,
            RADIUS_POINT_DATA: 2,
            AXIS_STROKE_WIDTH: 2,
            TITLE_HEIGHT: 20,
            SCROLLBAR_HEIGHT: 17,
            MIN_X_TICK_SPACING: 20,
        };
        this.createSVGGroups();
    }

    createSVGGroups() {
        this.dataGroup = Chart.createSVGNode("g", {});

        this.xAxisMarkersGroup = Chart.createSVGNode("g", {
            style: "stroke:rgb(0,0,0);stroke-width:1"
        });
        this.xAxisLabelsGroup = Chart.createSVGNode("g", {
            fill: "red",
            "font-size": 10,
        });
        this.yAxisMarkersGroup = Chart.createSVGNode("g", {
            style: "stroke:rgb(0,0,0);stroke-width:1"
        });
        this.yAxisLabelsGroup = Chart.createSVGNode("g", {
            fill: "red",
            "text-anchor": "end",
            "font-size": 12,
        });
        this.yAxisHelperLines = Chart.createSVGNode("g", {
            style: "stroke:rgb(200,200,200);stroke-width:1;stroke-dasharray:5"
        });

    }

    calculateAxisLength() {
        this.xAxisWidth = this._chartWidth - (this.maxTextWidthYLabels +
            this.params.GRAPH_LEFT_PADDING + this.params.GRAPH_RIGHT_PADDING +
            this.params.Y_LABEL_RIGHT_PADDING + this.params.Y_AXIS_MARKER_LENGTH);

        this.yAxisHeight = this._height - (this.maxTextWidthXLabels +
            this.params.GRAPH_TOP_PADDING + this.params.GRAPH_BOTTOM_PADDING +
            this.params.X_AXIS_MARKER_LENGTH + this.params.X_LABEL_TOP_PADDING);
    }

    static createSVGNode(n, v = {}) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (const p in v) {
            if (v[p] === undefined) {
                console.log(n)
            }
            n.setAttributeNS(null, p, v[p]);
        }
        return n
    }

    static getTextWidth(text, fontSize) {
        return 60;
    }

    static getMaxTextWidth(data, fontSize) {
        let maxTextWidth = 0;
        for (const label in data) {
            let temp = this.getTextWidth(label, fontSize);
            if (temp > maxTextWidth) {
                maxTextWidth = temp;
            }
        }
        return maxTextWidth;
    }

    draw(xAxisValueChanged=true, yAxisValueChanged=true) {
        if (yAxisValueChanged) {
            this.calculateNiceNumbers();
        }
        this.calculateActualCoords();
        this.updateOrCreateXAxisAndYAxis();
        if (xAxisValueChanged) {
            this.updateOrCreateXAxisMarkerAndLabels();
        }
        if (yAxisValueChanged) {
            this.updateOrCreateYAxisMarkerLabelsHelperlines();
        }
        this.updateOrCreateStyles();
        this.updateOrInitSVG();
        this.updateOrInitData(this.data);
    }

    initialization(data, metadata) {
        this.data = data;
        //this._dataCount = data.length;
        this.minY = metadata.get("globalLow") * 0.997;
        this.maxY = metadata.get("globalHigh") * 1.003;

        this.draw();

        //setTimeout(() => {
        //    this._height = 500;
        //    this.maxTicksY = 5;
        //    this.width = 500;
        //}, 10000)
    }

    updateOrInitData(data) {
        let dataIndex;
        const oldCount = this.dataGroup.childElementCount;
        for (let i = 0; i < data.length && i < oldCount; i++) {
            dataIndex = i;
            if (!this.isXAxisDescending) {
                dataIndex = data.length - 1 - i;
            }
            this.replaceCandle(i + 1, data[dataIndex][1], data[dataIndex][2], data[dataIndex][3], data[dataIndex][4], data[dataIndex][0]);
        }

        if (oldCount < data.length) {
            for (let i = oldCount; i < data.length; i++) {
                dataIndex = i;
                if (!this.isXAxisDescending) {
                    dataIndex = data.length - 1 - i;
                }
                this.addCandle(i + 1, data[dataIndex][1], data[dataIndex][2], data[dataIndex][3], data[dataIndex][4], data[dataIndex][0]);
            }
        } else {
            for (let i = data.length; i < oldCount; i++) {
                this.dataGroup.removeChild(this.dataGroup.lastChild);
            }
        }
    }

    update(data, metadata) {
        if (metadata.get("isInitialData") || metadata.get("globalLow") < this.niceMinY || metadata.get("globalHigh") > this.niceMaxY) {
            this.initialization(data, metadata);
        } else if (metadata.get("hasNewTimeStamp")) {
            this.updateWithNewXValue(data);
        } else {
            this.updateExistingXValue(data, metadata.get("updatedTimeStampIndex"));
        }
        this.data = data;
    }

    updateWithNewXValue(data) {
        if (this.isXAxisDescending) {
            this.shiftRight(data[0][0], data[0][1], data[0][2], data[0][3], data[0][4])
        } else {
            this.shiftLeft(data[0][0], data[0][1], data[0][2], data[0][3], data[0][4])
        }
    }

    updateExistingXValue(data, index) {
        this.replaceCandle(index + 1, data[index][1], data[index][2], data[index][3], data[index][4], data[index][0]);
    }

    shiftLeft(label, open, close, high, low) {
        const count = this.xAxisLabelsGroup.childElementCount;
        for (let i = 1; i < count; i++) {
            const newLabelText = this.xAxisLabelsGroup.children[i].innerHTML;
            this.xAxisLabelsGroup.children[i - 1].innerHTML = newLabelText;
        }

        for (let i = 1; i < this.dataGroup.childElementCount; i++) {
            const candle = this.dataGroup.children[i];
            const line = candle.children[0];
            const rect = candle.children[1];

            line.setAttribute("x1", this.xCoords[i - 1]);
            line.setAttribute("x2", this.xCoords[i - 1]);

            rect.setAttribute("x", this.xCoords[i - 1] - 8 / 2);
        }
        this.dataGroup.removeChild(this.dataGroup.firstChild);
        this.addCandle(count, open, close, high, low, label);
    }

    shiftRight(label, open, close, high, low) {
        const count = this.xAxisLabelsGroup.childElementCount;
        for (let i = count - 2; i >= 0; i--) {
            const newLabelText = this.xAxisLabelsGroup.children[i].innerHTML;
            this.xAxisLabelsGroup.children[i + 1].innerHTML = newLabelText;
        }

        for (let i = this.dataGroup.childElementCount - 2; i >= 0; i--) {
            const candle = this.dataGroup.children[i];
            const line = candle.children[0];
            const rect = candle.children[1];

            line.setAttribute("x1", this.xCoords[i + 1]);
            line.setAttribute("x2", this.xCoords[i + 1]);

            rect.setAttribute("x", this.xCoords[i + 1] - 8 / 2);
        }
        this.dataGroup.removeChild(this.dataGroup.lastChild);
        this.addCandle(1, open, close, high, low, label);

    }

    replaceCandle(x, open, close, high, low, label = null) {
        const newCandle = this.createCandle(x, open, close, high, low);
        const oldCandle = this.dataGroup.children[x - 1];
        if (label !== null) {
            this.xAxisLabelsGroup.children[x - 1].innerHTML = label;
        }
        this.dataGroup.replaceChild(newCandle, oldCandle);
    }


    calculateNiceNumbers() {
        let range = this.getNiceNumber(this.maxY - this.minY, false);
        this.tickSpacingY = this.getNiceNumber(range / (this.maxTicksY - 1), true);
        this.niceMinY = Math.floor(this.minY / this.tickSpacingY) * this.tickSpacingY;
        this.niceMaxY = Math.ceil(this.maxY / this.tickSpacingY) * this.tickSpacingY;
        this.tickCountY = Math.round((this.niceMaxY - this.niceMinY) / this.tickSpacingY);
    }

    getNiceNumber(range, round) {
        let exponent = Math.floor(Math.log10(range));
        let fraction = range / Math.pow(10, exponent);
        let niceFraction;

        if (round) {
            if (fraction < 1.5)
                niceFraction = 1;
            else if (fraction < 3)
                niceFraction = 2;
            else if (fraction < 7)
                niceFraction = 5;
            else
                niceFraction = 10;
        } else {
            if (fraction <= 1)
                niceFraction = 1;
            else if (fraction <= 2)
                niceFraction = 2;
            else if (fraction <= 5)
                niceFraction = 5;
            else
                niceFraction = 10;
        }

        this.niceFractionY = niceFraction * Math.pow(10, exponent);
        return this.niceFractionY;
    }

    updateOrCreateStyles() {
        if (this.styles === null) {
            this.styles = document.createElement("style");
            this.shadow.appendChild(this.styles);
        }
        this.styles.innerHTML = `
:host {
    position: relative;
    width: ${this._width}px;
    height: ${this._height + this.params.TITLE_HEIGHT}px;
}        

.dataThings {
    position: absolute;
    top: 0;
    left: 0;
    width: ${this._width}px;
    height: ${this._height + this.params.SCROLLBAR_HEIGHT + this.params.TITLE_HEIGHT}px;
    background-color: transparent;
    overflow-x: scroll;
    overflow-y: hidden;
}

.inner {
    position: absolute;
    top: ${this.params.TITLE_HEIGHT}px;
    left: 0;
    background-color: transparent;
    height: ${this._height}px;
    width: ${this._chartWidth}px;
}

.axis {
    position: absolute;
    top: ${this.params.TITLE_HEIGHT}px;
    left: 0;
    width: ${this.maxTextWidthYLabels + this.params.Y_AXIS_MARKER_LENGTH + this.params.Y_LABEL_RIGHT_PADDING + this.params.GRAPH_LEFT_PADDING + 1}px;  /* axis stroke width / 2 */
    height: ${this._height}px;
    background-color: white;
}

.caption {
    position: absolute;
    top: 0;
    left: 0;
    width: ${this._width}px;
    height: ${this.params.TITLE_HEIGHT}px;
    text-align: center;
   
}`;

    }

    updateOrInitSVG() {

        const xOffset = this.maxTextWidthYLabels + this.params.Y_AXIS_MARKER_LENGTH + this.params.Y_LABEL_RIGHT_PADDING +
            this.params.GRAPH_LEFT_PADDING;
        if (!this[isInitializedProperty]) {
            this.titleDiv = document.createElement("div");
            this.titleDiv.classList.add("caption");
            this.titleDiv.innerText = this._title;
            this.shadow.appendChild(this.titleDiv);

            this.svgYAxis = Chart.createSVGNode("svg", {"viewBox": "0 0 " + (xOffset + this.params.AXIS_STROKE_WIDTH / 2) + " " + (this._height)});
            this.svgYAxis.classList.add("axis");
            this.svg = Chart.createSVGNode("svg", {"viewBox": "0 0 " + (this._chartWidth) + " " + (this._height)});
            this.svg.classList.add("inner");

            this.svg.append(this.xAxis);
            this.svgYAxis.append(this.yAxis);
            this.svg.append(this.xAxisMarkersGroup);
            this.svgYAxis.append(this.yAxisMarkersGroup);
            this.svg.append(this.xAxisLabelsGroup);
            this.svgYAxis.append(this.yAxisLabelsGroup);
            this.svg.append(this.yAxisHelperLines);
            this.svg.append(this.dataGroup);

            let innerDiv = document.createElement("div");
            innerDiv.classList.add("dataThings");
            this.shadow.appendChild(innerDiv);
            innerDiv.appendChild(this.svg);
            this.shadow.appendChild(this.svgYAxis);

            this[isInitializedProperty] = true;
        } else {
            this.svgYAxis.setAttribute("viewBox", "0 0 " + (xOffset + this.params.AXIS_STROKE_WIDTH / 2) + " " + (this._height));
            this.svg.setAttribute("viewBox", "0 0 " + (this._chartWidth) + " " + (this._height));
        }
    }

    addPoint(x, y, color) {
        let circle = Chart.createSVGNode("circle", {
            cx: this.xCoords[x - 1],
            cy: this.calculateYCoordOfValue(y),
            fill: color,
            r: this.params.RADIUS_POINT_DATA,
        });
        this.dataGroup.append(circle);
    }

    addBar(x, y, color) {
        let bar = Chart.createSVGNode("rect", {
            x: this.xCoords[x - 1] - 4,
            y: this.calculateYCoordOfValue(y),
            width: 8,
            height: (this.yAxisHeight + this.params.GRAPH_TOP_PADDING) - this.calculateYCoordOfValue(y),
            fill: color,

        });
        this.dataGroup.append(bar);
    }

    addHorLine(x, y, color) {
        let line = Chart.createSVGNode("line", {
            x1: this.xCoords[x - 1] - 4,
            y1: this.calculateYCoordOfValue(y),
            x2: this.xCoords[x - 1] + 4,
            y2: this.calculateYCoordOfValue(y),
            style: "stroke:" + color + ";stroke-width:1"
        });
        this.dataGroup.append(line);
    }

    createCandle(x, open, close, high, low) {
        let candle = Chart.createSVGNode("g", {});
        let min = Math.min(open, close);
        let max = Math.max(open, close);

        let fillColor = "green";
        if (close < open) {
            fillColor = "red";
        }

        let minYCoord = this.calculateYCoordOfValue(min);
        let maxYCoord = this.calculateYCoordOfValue(max);

        let height = minYCoord - maxYCoord;
        let offset = 0;

        if (height < 1) {
            offset = (1 - height) / 2;
        }

        let line = Chart.createSVGNode("line", {
            x1: this.xCoords[x - 1],
            y1: this.calculateYCoordOfValue(high),
            x2: this.xCoords[x - 1],
            y2: this.calculateYCoordOfValue(low),
            style: "stroke:rgb(0,0,0);stroke-width:1"
        });
        let rect = Chart.createSVGNode("rect", {
            x: this.xCoords[x - 1] - 8 / 2,
            y: maxYCoord - offset,
            width: 8,
            height: minYCoord - maxYCoord + 2 * offset,
            fill: fillColor,
            style: "stroke-width:0.5;stroke:rgb(0,0,0)",
        });
        candle.append(line);
        candle.append(rect);
        return candle;
    }

    addCandle(x, open, close, high, low, label = null) {
        const candle = this.createCandle(x, open, close, high, low);
        if (label !== null) {
            this.xAxisLabelsGroup.children[x - 1].innerHTML = label;
        }
        if (x === this.dataGroup.childElementCount) {
            this.dataGroup.append(candle);
        } else {
            this.dataGroup.insertBefore(candle, this.dataGroup.children[x - 1]);
        }
    }

    calculateActualCoords() {
        this.calculateAxisLength();
        this.xTickWidth = this.xAxisWidth / this._dataCount;
        if (this.xTickWidth < this.params.MIN_X_TICK_SPACING) {
            console.log("too small x width");
            let additionalSpace = (this.params.MIN_X_TICK_SPACING - this.xTickWidth) * this._dataCount;
            this._chartWidth = this._chartWidth + additionalSpace;

            this.xTickWidth = this.params.MIN_X_TICK_SPACING;
            this.calculateAxisLength();
        }

        this.yTickHeight = this.yAxisHeight / (this.tickCountY + 1);
        this.yAxisMinCoordY = this.params.GRAPH_TOP_PADDING + this.yTickHeight / 2;

        this.yAxisMaxCoordY = this.yAxisMinCoordY + this.tickCountY * this.yTickHeight;
        this.xAxisMinCoordX = this.maxTextWidthYLabels +
            this.params.Y_AXIS_MARKER_LENGTH + this.params.Y_LABEL_RIGHT_PADDING +
            this.params.GRAPH_LEFT_PADDING + this.xTickWidth / 2;

        this.xAxisMaxCoordX = this.xAxisMinCoordX + (this._dataCount - 1) * this.xTickWidth;
    }

    calculateYCoordOfValue(value) {
        if (value < this.niceMinY || value > this.niceMaxY) {
            console.warn("value out of range: " + value);
        } else {
            const factor = (value - this.niceMinY) / (this.niceMaxY - this.niceMinY);
            return this.yAxisMaxCoordY + factor * (this.yAxisMinCoordY - this.yAxisMaxCoordY);
        }
    }

    updateOrCreateXAxisAndYAxis() {
        const xOffset = this.maxTextWidthYLabels + this.params.Y_AXIS_MARKER_LENGTH + this.params.Y_LABEL_RIGHT_PADDING +
            this.params.GRAPH_LEFT_PADDING;

        if (this.xAxis === null) {
            this.xAxis = Chart.createSVGNode("line", {});
        }
        if (this.yAxis === null) {
            this.yAxis = Chart.createSVGNode("line", {});
        }

        this.xAxis.setAttribute("x1", xOffset);
        this.xAxis.setAttribute("y1", this.yAxisHeight + this.params.GRAPH_TOP_PADDING);
        this.xAxis.setAttribute("x2", this.xAxisWidth + xOffset);
        this.xAxis.setAttribute("y2", this.yAxisHeight + this.params.GRAPH_TOP_PADDING);
        this.xAxis.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:" + this.params.AXIS_STROKE_WIDTH);

        this.yAxis.setAttribute("x1", xOffset);
        this.yAxis.setAttribute("y1", this.yAxisHeight + this.params.GRAPH_TOP_PADDING + this.params.AXIS_STROKE_WIDTH / 2);
        this.yAxis.setAttribute("x2", xOffset);
        this.yAxis.setAttribute("y2", this.params.GRAPH_TOP_PADDING);
        this.yAxis.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:" + this.params.AXIS_STROKE_WIDTH);
    }

    updateOrCreateXAxisMarkerAndLabels() {
        const currentCount = this.xAxisMarkersGroup.childElementCount;
        for (let i = 0; i < this._dataCount && currentCount; i++) {
            let xAxisMarkerX = this.xAxisMinCoordX + i * this.xTickWidth;
            this.xCoords[i] = (xAxisMarkerX);

            const xAxisMarker = this.xAxisMarkersGroup.children[i];
            xAxisMarker.setAttribute("x1", xAxisMarkerX);
            xAxisMarker.setAttribute("y1", this.yAxisHeight + this.params.GRAPH_TOP_PADDING);
            xAxisMarker.setAttribute("x2", xAxisMarkerX);
            xAxisMarker.setAttribute("y2", this.yAxisHeight + this.params.GRAPH_TOP_PADDING + this.params.X_AXIS_MARKER_LENGTH);

            const yOffset = this.params.GRAPH_TOP_PADDING + this.params.X_LABEL_TOP_PADDING + this.params.X_AXIS_MARKER_LENGTH;

            const text = this.xAxisLabelsGroup.children[i];
            text.setAttribute("x", xAxisMarkerX);
            text.setAttribute("y", this.yAxisHeight + yOffset);
            text.setAttribute("transform", "rotate(60," + xAxisMarkerX + "," + (this.yAxisHeight + yOffset) + ")");

        }
        if (this._dataCount < currentCount) {
            for (let i = 0; i < currentCount - this._dataCount; i++) {
                this.xAxisMarkersGroup.removeChild(this.xAxisMarkersGroup.lastChild);
                this.xAxisLabelsGroup.removeChild(this.xAxisLabelsGroup.lastChild);
            }
        } else {
            for (let i = currentCount; i < this._dataCount; i++) {
                let xAxisMarkerX = this.xAxisMinCoordX + i * this.xTickWidth;
                this.xCoords.push(xAxisMarkerX);

                let xAxisMarker = Chart.createSVGNode("line", {
                    x1: xAxisMarkerX,
                    y1: this.yAxisHeight + this.params.GRAPH_TOP_PADDING,
                    x2: xAxisMarkerX,
                    y2: this.yAxisHeight + this.params.GRAPH_TOP_PADDING + this.params.X_AXIS_MARKER_LENGTH
                });
                this.xAxisMarkersGroup.append(xAxisMarker);

                const yOffset = this.params.GRAPH_TOP_PADDING + this.params.X_LABEL_TOP_PADDING + this.params.X_AXIS_MARKER_LENGTH;
                let text = Chart.createSVGNode("text", {
                    x: xAxisMarkerX,
                    y: this.yAxisHeight + yOffset,
                    "alignment-baseline": "middle",
                    transform: "rotate(60," + xAxisMarkerX + "," + (this.yAxisHeight + yOffset) + ")",
                });
                text.innerHTML = "point" + (i + 1);
                this.xAxisLabelsGroup.append(text);
            }
        }
    }

    updateOrCreateYAxisMarkerLabelsHelperlines() {
        const xOffset = this.maxTextWidthYLabels + this.params.GRAPH_LEFT_PADDING + this.params.Y_LABEL_RIGHT_PADDING + this.params.Y_AXIS_MARKER_LENGTH;

        const currentYAxisMarkerCount = this.yAxisMarkersGroup.childElementCount;
        for (let i = 0; i < this.tickCountY+1 && currentYAxisMarkerCount; i++) {
            let yAxisMarkerY = this.yAxisMinCoordY + i * this.yTickHeight;

            const yAxisMarker = this.yAxisMarkersGroup.children[i];
            yAxisMarker.setAttribute("x1", xOffset - this.params.Y_AXIS_MARKER_LENGTH);
            yAxisMarker.setAttribute("y1", yAxisMarkerY);
            yAxisMarker.setAttribute("x2", xOffset);
            yAxisMarker.setAttribute("y2", yAxisMarkerY);

            const text = this.yAxisLabelsGroup.children[i];
            text.setAttribute("x", this.maxTextWidthYLabels + this.params.GRAPH_LEFT_PADDING);
            text.setAttribute("y", yAxisMarkerY);

            const helperLine = this.yAxisHelperLines.children[i];
            helperLine.setAttribute("x1", xOffset + this.params.AXIS_STROKE_WIDTH / 2);
            helperLine.setAttribute("y1", yAxisMarkerY);
            helperLine.setAttribute("x2", this.xAxisWidth + xOffset);
            helperLine.setAttribute("y2", yAxisMarkerY);
        }

        if (this.tickCountY + 1 < currentYAxisMarkerCount) {
            for (let i = 0; i < currentYAxisMarkerCount - this.tickCountY - 1; i++) {
                this.yAxisMarkersGroup.removeChild(this.yAxisMarkersGroup.lastChild);
                this.yAxisLabelsGroup.removeChild(this.yAxisLabelsGroup.lastChild);

                this.yAxisHelperLines.removeChild(this.yAxisHelperLines.lastChild);

            }
        } else {
            for (let i = currentYAxisMarkerCount; i < this.tickCountY + 1; i++) {
                let yAxisMarkerY = this.yAxisMinCoordY + i * this.yTickHeight;

                let yAxisMarker = Chart.createSVGNode("line", {
                    x1: xOffset - this.params.Y_AXIS_MARKER_LENGTH,
                    y1: yAxisMarkerY,
                    x2: xOffset,
                    y2: yAxisMarkerY,
                });
                this.yAxisMarkersGroup.append(yAxisMarker);

                let text = Chart.createSVGNode("text", {
                    x: this.maxTextWidthYLabels + this.params.GRAPH_LEFT_PADDING,
                    y: yAxisMarkerY,
                    "alignment-baseline": "central",
                });
                text.innerHTML = round(this.niceMinY + (this.tickCountY - i) * this.tickSpacingY, 5);
                this.yAxisLabelsGroup.append(text);

                let helperLine = Chart.createSVGNode("line", {
                    x1: xOffset + this.params.AXIS_STROKE_WIDTH / 2,
                    y1: yAxisMarkerY,
                    x2: this.xAxisWidth + xOffset,
                    y2: yAxisMarkerY,
                });
                this.yAxisHelperLines.append(helperLine);
            }
        }
    }
}