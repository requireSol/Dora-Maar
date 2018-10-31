import {setPlatformStatus, setServerId, supportedVersion} from "./Connector.js";
import {pendingQueue, getIdFromRequest, internalUnsubscribe, resubscribeAllChannels} from "./SubscriptionManager.js";
import {_assignObserverToId, informObserver} from "./ObserverHandler.js";
import {executeAction} from "./TimerAndActions.js";


const errorCodes = {
    10000: "Unknown event",
    10001: "Unknown pair",
    10011: "Unknown Book precision",
    10012: "Unknown Book length",
    10300: "Subscription failed (generic)",
    10301: "Already subscribed",
    10302: "Unknown channel",
    10305: "Reached limit of open channels",
    10400: "Unsubscription failed (generic)",
    10401: "Not subscribed",

};

/**
 * Handles the error messages from the server.
 * @param {Object} errorMessage the message from the server
 */
export function handleErrorMessage(errorMessage) {
    const errorCode = errorMessage["code"];
    console.log(errorCodes[errorCode]);
    switch (errorCode) {
        case 10301:
            let needRestart = false;
            let listOfSubDesc = pendingQueue.popMatchingRequestsSubDescriptors(errorMessage);
            for (const subDesc of listOfSubDesc) {
                const chanId = getIdFromRequest(subDesc.apiRequest);
                // if this is undefined the subscription is lost -> need new websocket connection
                if (chanId === undefined) {
                    needRestart = true;
                    break;
                }
                _assignObserverToId(chanId, subDesc);
            }
            if (needRestart) {
                executeAction("reconnect");
            }
            break;
        case 10400:
            const chanId = errorMessage["chanId"];
            internalUnsubscribe({status: "OK", chanId: chanId});
            break;
    }

}


const infoCodes = {
    20051: "Stop/Restart Websocket Server",
    20060: "Entering in Maintenance mode",
    20061: "Maintenance ended"
};

/**
 * Handles the info messages with a code from the server.
 * @param {Object} infoMessage the message from the server
 */
export function handleInfoMessage(infoMessage) {
    const infoCode = infoMessage["code"];
    console.log(infoCodes[infoCode]);
    switch (infoCode) {
        case 20051:
            informObserver({
                "level": "info",
                "title": infoCodes[infoCode],
                "msg": "server is restarting / stopping"
            });
            break;

        case 20060:
            informObserver({
                "level": "info",
                "title": infoCodes[infoCode],
                "msg": "server entered maintenance mode"
            });

            break;
        case 20061:
            resubscribeAllChannels();
            informObserver({
                "level": "info",
                "title": infoCodes[infoMessage],
                "msg": "server is operative again"
            });
            break;
    }
}

/**
 * Handles the info message after connecting to the server.
 * @param {Object} message the info message from the server
 */
export function handleConnectionInfoMessage(message) {
    const status = message["platform"]["status"];
    const version = message["version"];
    const serverId = message["serverId"];

    if (version !== supportedVersion) {
        console.error("unsupported api version: " + version + ", supported version: " + supportedVersion);
    }

    if (status === 1) {
        setPlatformStatus(1);
        setServerId(serverId);
        informObserver({
            "level": "success",
            "title": "Successfully Connected",
            "msg": "server is operative"
        })
    } else if (status === 0) {
        setPlatformStatus(0);
        setServerId(serverId);
        informObserver({
            "level": "warn",
            "title": "Successfully Connected",
            "msg": "server is in maintenance mode"
        })
    }
}
