export class CandlesData {
    constructor(snapshotData) {
        this.maxLength = 240;
        this.candles = snapshotData.slice(0, this.maxLength);

        this.globalHigh = this.calcGlobalHigh();
        this.globalLow = this.calcGlobalLow();
        this.updatedTimeStampIndex = -1;
        this.hasNewTimeStamp = false;

    }

    update(updateData) {
        updateData = updateData[0];
        this.updatedTimeStampIndex = -1;
        this.hasNewTimeStamp = false;

        if (updateData[0] > this.candles[0][0]) {
            this.candles.splice(-1, 1);
            this.candles.splice(0, 0, updateData);
            this.hasNewTimeStamp = true;
            console.info("new timestamp");
        } else {
            for (let i = 0; i < this.candles.length; i++) {
                if (updateData[0] === this.candles[i][0]) {
                    this.candles[i] = updateData;
                    this.updatedTimeStampIndex = i;
                    console.info("update timestamp at index " + i);
                    break;
                }
            }
        }

        this.globalHigh = this.calcGlobalHigh();
        this.globalLow = this.calcGlobalLow();
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

