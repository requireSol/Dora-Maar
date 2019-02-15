import {round} from "../common/utils/MathUtils.js";
import {getTextMetrics} from "../common/utils/RenderUtils.js";
import {mtsToLocaleTimeString} from "../common/utils/DateUtils.js";

const isInitializedProperty = Symbol();

export class Chart extends HTMLDivElement {
    connectedCallback() {
        this.shadow = this.attachShadow({mode: "open"});
    }

    set title(title) {
        this._title = title;
        if (this[isInitializedProperty]) {
            this.titleDiv.textContent = title;
        }
    }

    set dataCount(dataCount) {
        this._dataCount = dataCount;
        if (this[isInitializedProperty]) {
            this.draw();
        }
    }

    set width(width) {
        this._width = width;
        this._chartWidth = width;
        if (this[isInitializedProperty]) {
            this.draw();
        }
    }

    set height(height) {
        this._height = height - this.params.SCROLLBAR_HEIGHT - this.params.TITLE_HEIGHT;
        if (this[isInitializedProperty]) {
            this.draw();
        }
    }

    set isXAxisDescending(isXAxisDescending) {
        this._isXAxisDescending = isXAxisDescending;
        if (this[isInitializedProperty]) {
            this.updateOrInitData(this.data);
        }
    }

    set xLabelModifier(xLabelModifier) {
        this._xLabelModifier = xLabelModifier;
        if (this[isInitializedProperty]) {
            this.updateXLabels();
        }
    }

    set yLabelModifier(yLabelModifier) {
        this._yLabelModifier = yLabelModifier;
        if (this[isInitializedProperty]) {
            this.updateYLabels();
        }
    }

    set valueModifier(valueModifier) {
        this._valueModifier = valueModifier;
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

        this._xLabelModifier = mtsToLocaleTimeString;
        this._yLabelModifier = null;
        this._valueModifier = x => round(x, 2);

        this.yLabelValues = [];
        this.xCoords = [];
        this.maxTextWidthYLabels = 35;
        this.maxTextWidthXLabels = 30;
        this.data = [];

        this.params = {
            GRAPH_LEFT_PADDING: 5,
            GRAPH_RIGHT_PADDING: 15,
            GRAPH_ADDITIONAL_RIGHT_PADDING: 0,
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
            Y_AXIS_LABEL_FONT_SIZE: 12,
            X_AXIS_LABEL_FONT_SIZE: 10,
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
            "font-size": this.params.X_AXIS_LABEL_FONT_SIZE,
        });
        this.yAxisMarkersGroup = Chart.createSVGNode("g", {
            style: "stroke:rgb(0,0,0);stroke-width:1"
        });
        this.yAxisLabelsGroup = Chart.createSVGNode("g", {
            fill: "red",
            "text-anchor": "end",
            "font-size": this.params.Y_AXIS_LABEL_FONT_SIZE,
        });
        this.yAxisHelperLines = Chart.createSVGNode("g", {
            style: "stroke:rgb(200,200,200);stroke-width:1;stroke-dasharray:5"
        });

        this.dataTooltipTriggers = Chart.createSVGNode("g", {});

    }

    calculateAxisLength() {
        this.xAxisWidth = this._chartWidth - (this.maxTextWidthYLabels +
            this.params.GRAPH_LEFT_PADDING + this.params.GRAPH_RIGHT_PADDING + this.params.GRAPH_ADDITIONAL_RIGHT_PADDING +
            this.params.Y_LABEL_RIGHT_PADDING + this.params.Y_AXIS_MARKER_LENGTH);

        this.yAxisHeight = this._height - (this.maxTextWidthXLabels +
            this.params.GRAPH_TOP_PADDING + this.params.GRAPH_BOTTOM_PADDING +
            this.params.X_AXIS_MARKER_LENGTH + this.params.X_LABEL_TOP_PADDING);
    }

    static createSVGNode(n, v = {}) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (const p in v) {
            n.setAttributeNS(null, p, v[p]);
        }
        return n
    }

    static getMaxTextWidth(data, font, modifier = null) {
        let maxTextWidth = 0;
        for (const label of data) {
            let temp = getTextMetrics((modifier === null) ? label : modifier(label), font).width;
            if (temp > maxTextWidth) {
                maxTextWidth = temp;
            }
        }
        return maxTextWidth;
    }

    adjustParams() {
        this.maxTextWidthYLabels = Chart.getMaxTextWidth(this.yLabelValues, `${this.params.Y_AXIS_LABEL_FONT_SIZE}px Arial`, this._yLabelModifier);
        const maxWidth = Chart.getMaxTextWidth(this.data, `${this.params.X_AXIS_LABEL_FONT_SIZE}px Arial`, (x) => (this._xLabelModifier === null) ? x[0] : this._xLabelModifier(x[0]));
        this.maxTextWidthXLabels = Math.sin(Math.PI / 3) * maxWidth;
        this.params.GRAPH_ADDITIONAL_RIGHT_PADDING = Math.cos(Math.PI / 3) * maxWidth;
    }

    draw(xAxisValueChanged = true, yAxisValueChanged = true) {
        if (yAxisValueChanged) {
            this.calculateNiceNumbers();
        }
        this.adjustParams();
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
        this.minY = metadata.get("globalLow") * 0.997;
        this.maxY = metadata.get("globalHigh") * 1.003;

        this.draw();
    }

    updateOrInitData(data) {
        let dataIndex;
        const oldCount = this.dataGroup.childElementCount;
        for (let i = 0; i < data.length && i < oldCount && i < this._dataCount; i++) {
            dataIndex = i;
            if (!this.isXAxisDescending) {
                dataIndex = data.length - 1 - i;
            }
            this.replaceCandle(i + 1, data[dataIndex][1], data[dataIndex][2], data[dataIndex][3], data[dataIndex][4], data[dataIndex][0]);
        }

        if (oldCount < this._dataCount) {
            for (let i = oldCount; i < data.length && i < this._dataCount; i++) {
                dataIndex = i;
                if (!this.isXAxisDescending) {
                    dataIndex = data.length - 1 - i;
                }
                this.addCandle(i + 1, data[dataIndex][1], data[dataIndex][2], data[dataIndex][3], data[dataIndex][4], data[dataIndex][0]);
            }
        } else {
            for (let i = this._dataCount; i < oldCount; i++) {
                this.dataGroup.removeChild(this.dataGroup.lastChild);
            }
        }
    }

    updateXLabels() {
        for (let i = 0; i < this.data.length; i++) {
            this.xAxisLabelsGroup[i].textContent = (this._xLabelModifier !== null) ? this._xLabelModifier(this.data[i][0]) : this.data[i][0];
        }
    }

    updateYLabels() {
        for (let i = 0; i < this.yLabelValues.length; i++) {
            this.yAxisLabelsGroup[i].textContent = (this._yLabelModifier !== null) ? this._yLabelModifier(this.yLabelValues[i]) : this.yLabelValues[i];
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
            const newLabelText = this.xAxisLabelsGroup.children[i].textContent;
            this.xAxisLabelsGroup.children[i - 1].textContent = newLabelText;
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
            const newLabelText = this.xAxisLabelsGroup.children[i].textContent;
            this.xAxisLabelsGroup.children[i + 1].textContent = newLabelText;
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
            this.xAxisLabelsGroup.children[x - 1].textContent = (this._xLabelModifier !== null) ? this._xLabelModifier(label) : label;
        }
        this.dataGroup.replaceChild(newCandle, oldCandle);
    }


    calculateNiceNumbers() {
        let range = this.getNiceNumber(this.maxY - this.minY, false);
        this.tickSpacingY = this.getNiceNumber(range / (this.maxTicksY - 1), true);
        this.niceMinY = Math.floor(this.minY / this.tickSpacingY) * this.tickSpacingY;
        this.niceMaxY = Math.ceil(this.maxY / this.tickSpacingY) * this.tickSpacingY;
        this.tickCountY = Math.round((this.niceMaxY - this.niceMinY) / this.tickSpacingY);

        const currentLength = this.yLabelValues.length;
        for (let i = 0; i <= this.tickCountY; i++) {
            if (i < currentLength) {
                this.yLabelValues[i] = round(this.niceMinY + (this.tickCountY - i) * this.tickSpacingY, 5);
            } else {
                this.yLabelValues.push(round(this.niceMinY + (this.tickCountY - i) * this.tickSpacingY, 5));
            }
        }
        console.log(this.yLabelValues);
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
   
}

.tooltip {
    position: absolute;
    right: 0;
    top: ${this.params.TITLE_HEIGHT}px;
    background-color: yellow;
    display: none;
    font-size: 10px;
    z-index: 5;
    pointer-events: none;
    width: 100px;
}`;

    }

    updateOrInitSVG() {

        const xOffset = this.maxTextWidthYLabels + this.params.Y_AXIS_MARKER_LENGTH + this.params.Y_LABEL_RIGHT_PADDING +
            this.params.GRAPH_LEFT_PADDING;
        if (!this[isInitializedProperty]) {
            // TOOLTIP //
            this.tooltip = document.createElement("div");
            this.tooltip.innerHTML = `
<table>
<tbody>
<tr>
<td>time</td>
<td>-</td>
</tr>
<tr>
<td>open</td>
<td>-</td>
</tr>
<tr>
<td>close</td>
<td>-</td>
</tr>
<tr>
<td>high</td>
<td>-</td>
</tr>
<tr>
<td>low</td>
<td>-</td>
</tr>
<tr>
<td>volume</td>
<td>-</td>
</tr>
</tbody>
</table>`;
            const tooltipRows = this.tooltip.children[0].children[0].children;
            this.tooltip.timeCell = tooltipRows[0].children[1];
            this.tooltip.openCell = tooltipRows[1].children[1];
            this.tooltip.closeCell = tooltipRows[2].children[1];
            this.tooltip.highCell = tooltipRows[3].children[1];
            this.tooltip.lowCell = tooltipRows[4].children[1];
            this.tooltip.volumeCell = tooltipRows[5].children[1];
            this.tooltip.classList.add("tooltip");
            this.shadow.appendChild(this.tooltip);

            // TITLE //
            this.titleDiv = document.createElement("div");
            this.titleDiv.classList.add("caption");
            this.titleDiv.textContent = this._title;
            this.shadow.appendChild(this.titleDiv);

            // SVG GRAPH //
            this.svgYAxis = Chart.createSVGNode("svg", {"viewBox": `0 0 ${xOffset + this.params.AXIS_STROKE_WIDTH / 2} ${this._height}`});
            this.svgYAxis.classList.add("axis");
            this.svg = Chart.createSVGNode("svg", {"viewBox": `0 0 ${this._chartWidth} ${this._height}`});
            this.svg.classList.add("inner");

            this.svg.append(this.xAxis);
            this.svgYAxis.append(this.yAxis);
            this.svg.append(this.xAxisMarkersGroup);
            this.svgYAxis.append(this.yAxisMarkersGroup);
            this.svg.append(this.xAxisLabelsGroup);
            this.svgYAxis.append(this.yAxisLabelsGroup);
            this.svg.append(this.yAxisHelperLines);
            this.svg.append(this.dataGroup);
            this.svg.append(this.dataTooltipTriggers);

            let innerDiv = document.createElement("div");
            innerDiv.classList.add("dataThings");
            this.shadow.appendChild(innerDiv);
            innerDiv.appendChild(this.svg);
            this.shadow.appendChild(this.svgYAxis);

            this[isInitializedProperty] = true;
        } else {
            this.svgYAxis.setAttribute("viewBox", `0 0 ${xOffset + this.params.AXIS_STROKE_WIDTH / 2} ${this._height}`);
            this.svg.setAttribute("viewBox", `0 0 ${this._chartWidth} ${this._height}`);
            this.titleDiv.textContent = this._title;
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
            this.xAxisLabelsGroup.children[x - 1].textContent = (this._xLabelModifier !== null) ? this._xLabelModifier(label) : label;
        }
        if (x === this.dataGroup.childElementCount) {
            this.dataGroup.append(candle);
        } else {
            this.dataGroup.insertBefore(candle, this.dataGroup.children[x - 1]);
        }
    }

    calculateActualCoords() {
        this._chartWidth = this._width;

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
        this.xAxis.setAttribute("style", `stroke:rgb(0,0,0);stroke-width:${this.params.AXIS_STROKE_WIDTH}`);

        this.yAxis.setAttribute("x1", xOffset);
        this.yAxis.setAttribute("y1", this.yAxisHeight + this.params.GRAPH_TOP_PADDING + this.params.AXIS_STROKE_WIDTH / 2);
        this.yAxis.setAttribute("x2", xOffset);
        this.yAxis.setAttribute("y2", this.params.GRAPH_TOP_PADDING);
        this.yAxis.setAttribute("style", `stroke:rgb(0,0,0);stroke-width:${this.params.AXIS_STROKE_WIDTH}`);
    }

    updateOrCreateXAxisMarkerAndLabels() {
        const currentCount = this.xAxisMarkersGroup.childElementCount;
        for (let i = 0; i < this._dataCount && i < currentCount; i++) {
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
            text.setAttribute("transform", `rotate(60,${xAxisMarkerX},${this.yAxisHeight + yOffset})`);

            const tooltipTrigger = this.dataTooltipTriggers.children[i];
            tooltipTrigger.setAttribute("x", xAxisMarkerX - this.xTickWidth * 0.5);
            tooltipTrigger.setAttribute("y", this.yAxisMinCoordY);
            tooltipTrigger.setAttribute("height", this.yAxisMaxCoordY - this.yAxisMinCoordY);
            tooltipTrigger.setAttribute("width", this.xTickWidth);
        }

        if (this._dataCount < currentCount) {
            for (let i = 0; i < currentCount - this._dataCount; i++) {
                this.xAxisMarkersGroup.removeChild(this.xAxisMarkersGroup.lastChild);
                this.xAxisLabelsGroup.removeChild(this.xAxisLabelsGroup.lastChild);
                this.dataTooltipTriggers.removeChild(this.dataTooltipTriggers.lastChild);
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
                    transform: `rotate(60,${xAxisMarkerX},${this.yAxisHeight + yOffset})`,
                });
                text.textContent = "";
                this.xAxisLabelsGroup.append(text);

                let tooltipTrigger = Chart.createSVGNode("rect", {
                    "x": xAxisMarkerX - this.xTickWidth * 0.5,
                    "y": this.yAxisMinCoordY,
                    "height": this.yAxisMaxCoordY - this.yAxisMinCoordY,
                    "width": this.xTickWidth,
                    "fill": "transparent",
                });

                this.dataTooltipTriggers.append(tooltipTrigger);
                const thisContext = this;
                tooltipTrigger.addEventListener("mouseenter", (evt => {
                    if (i < this.data.length) {
                        thisContext.tooltip.timeCell.textContent = (this._xLabelModifier !== null) ? this._xLabelModifier(this.data[i][0]) : this.data[i][0];
                        thisContext.tooltip.openCell.textContent = (this._valueModifier !== null) ? this._valueModifier(this.data[i][1]) : this.data[i][1];
                        thisContext.tooltip.closeCell.textContent = (this._valueModifier !== null) ? this._valueModifier(this.data[i][2]) : this.data[i][2];
                        thisContext.tooltip.highCell.textContent = (this._valueModifier !== null) ? this._valueModifier(this.data[i][3]) : this.data[i][3];
                        thisContext.tooltip.lowCell.textContent = (this._valueModifier !== null) ? this._valueModifier(this.data[i][4]) : this.data[i][4];
                        thisContext.tooltip.volumeCell.textContent = (this._valueModifier !== null) ? this._valueModifier(this.data[i][5]) : this.data[i][5];

                        thisContext.tooltip.style.display = "initial";
                    }

                }));
                tooltipTrigger.addEventListener("mouseleave", (evt => {
                    thisContext.tooltip.style.display = "none";

                }));
            }
        }
    }

    updateOrCreateYAxisMarkerLabelsHelperlines() {
        const xOffset = this.maxTextWidthYLabels + this.params.GRAPH_LEFT_PADDING + this.params.Y_LABEL_RIGHT_PADDING + this.params.Y_AXIS_MARKER_LENGTH;

        const currentYAxisMarkerCount = this.yAxisMarkersGroup.childElementCount;
        for (let i = 0; i < this.tickCountY + 1 && currentYAxisMarkerCount; i++) {
            let yAxisMarkerY = this.yAxisMinCoordY + i * this.yTickHeight;

            const yAxisMarker = this.yAxisMarkersGroup.children[i];
            yAxisMarker.setAttribute("x1", xOffset - this.params.Y_AXIS_MARKER_LENGTH);
            yAxisMarker.setAttribute("y1", yAxisMarkerY);
            yAxisMarker.setAttribute("x2", xOffset);
            yAxisMarker.setAttribute("y2", yAxisMarkerY);

            const text = this.yAxisLabelsGroup.children[i];
            text.setAttribute("x", this.maxTextWidthYLabels + this.params.GRAPH_LEFT_PADDING);
            text.setAttribute("y", yAxisMarkerY);
            const textValue = (this._yLabelModifier !== null) ? this._yLabelModifier(this.yLabelValues[i]) : this.yLabelValues[i];
            text.textContent = (this._yLabelModifier !== null) ? this._yLabelModifier(textValue) : textValue;

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
                const textValue = this.yLabelValues[i];
                text.textContent = (this._yLabelModifier !== null) ? this._yLabelModifier(textValue) : textValue;

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