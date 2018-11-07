import {requestData, stopDataRequest} from "../core/ObserverHandler.js";

export class Observer {
    constructor() {
    }

    info() {
        console.warn("not implemented")
    }

    update() {
        console.warn("not implemented")
    }

    subscribeToData(clientRequest) {
        requestData(this, clientRequest);
    }

    unsubscribeFromData() {
        stopDataRequest(this);
    }
}
const isInitializedProperty = Symbol();

export class ObserverBaseElement extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this[isInitializedProperty] = false;

    }

    connectedCallback() {
        if (!this[isInitializedProperty]) {
            const style = document.createElement("style");
            style.innerText = `
    :host {
        float: left;
        position: relative;
}`;
            this.shadow.appendChild(style);
            this[isInitializedProperty] = true;
        }
    }

    info() {
        console.warn("not implemented")
    }

    update() {
        console.warn("not implemented")
    }

    subscribeToData(clientRequest) {
        requestData(this, clientRequest);
    }

    unsubscribeFromData() {
        stopDataRequest(this);
    }
}