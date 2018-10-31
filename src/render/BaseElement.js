import {requestData, stopDataRequest} from "../core/ObserverHandler.js";

export class Observer {
    constructor() {
        this.clientRequest = null;
    }

    info() {
        console.warn("not implemented")
    }

    update() {
        console.warn("not implemented")
    }

    subscribeToData(clientRequest) {
        requestData(this, clientRequest);
        this.clientRequest = clientRequest;
    }

    unsubscribeFromData() {
        stopDataRequest(this);
    }
}



export class ObserverBaseElement extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});

    }

    connectedCallback() {
        const style = document.createElement("style");
        style.innerText = `
     :host {
    float: left;
    position: relative;
}`;
        this.shadow.appendChild(style);
    }

    info() {
        console.warn("not implemented")
    }

    update() {
        console.warn("not implemented")
    }

    subscribeToData(clientRequest) {
        requestData(this, clientRequest);
        this.clientRequest = clientRequest;
    }

    unsubscribeFromData() {
        stopDataRequest(this);
    }
}