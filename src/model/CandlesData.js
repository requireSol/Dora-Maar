export class CandlesData {
    constructor(snapshotData) {
        this.candles = snapshotData.slice(0, this.maxLength);
        this.maxLength = 60;

        this.globalHigh = this.calcGlobalHigh();
        this.globalLow = this.calcGlobalLow();
    }

    update(updateData) {
        this.candles.splice(-1, 1);
        this.candles.splice(0, 0, updateData);

        this.updateGlobalLow(updateData[4]);
        this.updateGlobalHigh(updateData[3]);
    }

    static getDataFields() {
        return ["timestamp", "open", "close", "high", "low", "volume"];
    }

    updateGlobalLow(value) {
        if (this.candles[this.candles.length - 1] === value) {
            this.globalLow = this.calcGlobalLow();
        } else {
            if (value < this.globalLow) {
                this.globalLow = value;
            }
        }
    }

    updateGlobalHigh(value) {
        if (this.candles[this.candles.length - 1] === value) {
            this.globalHigh = this.calcGlobalHigh();
        } else {
            if (value > this.globalHigh) {
                this.globalHigh = value;
            }
        }
    }

    calcGlobalLow() {
        let globalLow = Infinity;
        for (const candle of this.candles) {
            if (candle[4] < globalLow) {
                globalLow = candle[4];
            }
        }
        return globalLow;
    }

    calcGlobalHigh() {
        let globalHigh = -Infinity;
        for (const candle of this.candles) {
            if (candle[3] > globalHigh) {
                globalHigh = candle[3];
            }
        }
        return globalHigh;
    }
}

