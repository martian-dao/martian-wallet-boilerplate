import "./createNFTBundle_combined.js";
import "./aptosUtilityBundle.js";
import "./secureMnemonicBundle.js";

let unlmne = [];
let currRes = {};
let currResNC = {};
let currResN = {};
let currResST = {};
let timeout = 60;

function keepalive() {
    // console.log("Ping")
    if (unlmne.length === 2) {
        if (unlmne[1] < new Date().getTime()) {
            clearInterval()
        }
    }
}


function cacheAccount(code) {
    let cachetimeout = new Date().getTime() + timeout * 60000

    if (unlmne.length === 2 && unlmne[1] >= new Date().getTime()) {
      cachetimeout = unlmne[1]
    }

    chrome.storage.local.get(
        ["address", "accountMetadata"],
        async (response) => {
            const account = await aptosUtility.getAccountFromMetaData(
                code,
                response.accountMetadata[response.address]
            );
            const res = {
                account: account,
                address: response.address,
                code: code,
            };
            unlmne = [res, cachetimeout];
        }
    );
}


setInterval(() => {
    keepalive()
}, 30000)

chrome.runtime.onInstalled.addListener((reason) => {
    if (reason.reason == "install") {
        chrome.storage.local.set({ OnboardingIsDone: false });
        chrome.tabs.create({
            url: "./onboarding.html",
        });
    }
});

function launchPopup(data, message, sender, sendResponse) {
    const searchParams = new URLSearchParams();
    searchParams.set("origin", sender.origin);
    searchParams.set("id", message.id);
    searchParams.set("iconurl", message.metainfo.iconUrl);
    searchParams.set("title", message.metainfo.docTitle);

    if (data.name && data.name === "connect") {
        searchParams.set("tabId", data.tabId);
    } else if (data.name && data.name === "collection") {
        searchParams.set("name", data.collectionName);
        searchParams.set("collectionDesc", data.collectionDesc);
        searchParams.set("collectionName", data.collectionName);
        searchParams.set("collectionUrl", data.collectionUrl);
        searchParams.set("address", data.address);
    } else if (data.name && data.name === "nft") {
        searchParams.set("name", data.nftName);
        searchParams.set("nftDesc", data.nftDesc);
        searchParams.set("nftName", data.nftName);
        searchParams.set("nftUrl", data.nftUrl);
        searchParams.set("collectionName", data.collectionName);
        searchParams.set("address", data.address);
    } else if (data.name && data.name === "SendSignTxn") {
        searchParams.set("func", data.func);
        searchParams.set("args", JSON.stringify(data.args));
        searchParams.set("type_args", JSON.stringify(data.type_args));
    }

    chrome.storage.local.get(["address", "accountMetadata"], (response) => {
        const address = response.address;
        const name = response.accountMetadata[response.address].name;

        searchParams.set("accountAddress", address);
        searchParams.set("accountName", name);

        chrome.windows.getLastFocused((focusedWindow) => {
            chrome.windows.create({
                url: data.FileUrl + "#" + searchParams.toString(),
                type: "popup",
                width: 400,
                height: 570,
                top: focusedWindow.top,
                left: focusedWindow.left + (focusedWindow.width - 400),
                focused: true,
            });
        });

    });
}

function handleConnect(message, sender, sendResponse) {
    chrome.storage.local.get(["whitelistedDomains", "address"], (result) => {
        const whitelistedDomains = result.whitelistedDomains;
        const walletAddress = result.address;

        if (whitelistedDomains) {
            if (JSON.parse(whitelistedDomains)[sender.origin]) {
                if (JSON.parse(whitelistedDomains)[sender.origin].includes(walletAddress)) {

                    const sendResp = currRes[message.id];
                    sendResp({
                        method: "connected",
                        id: message.id,
                        status: 200,
                        address: walletAddress,
                        tabId: sender.tab.id,
                    });
                    delete currRes[message.id];
                }
                else {
                    launchPopup(
                        {
                            FileUrl: "notification.html",
                            name: "connect",
                            tabId: sender.tab.id,
                        },
                        message,
                        sender,
                        sendResponse
                    );
                }

            } else {
                launchPopup(
                    {
                        FileUrl: "notification.html",
                        name: "connect",
                        tabId: sender.tab.id,
                    },
                    message,
                    sender,
                    sendResponse
                );
            }
        } else {
            launchPopup(
                { FileUrl: "notification.html", name: "connect", tabId: sender.tab.id },
                message,
                sender,
                sendResponse
            );
        }
    });
}

function handleDisconnect(message, sender, sendResponse) {
    chrome.storage.local.get("whitelistedDomains", (result) => {
        let whitelistedDomains = JSON.parse(result.whitelistedDomains);
        delete whitelistedDomains[sender.origin];
        chrome.storage.local.set({ whitelistedDomains: whitelistedDomains }, () =>
            sendResponse({ method: "disconnected", id: message.id })
        );
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "open onboarding page") {
        chrome.tabs.create({ url: chrome.runtime.getURL("./onboarding.html") });
    } else if (message === "open onboarding page restore true") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("./onboarding.html") + "?restore=true",
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "acbc") {
        if (message.method === "connect") {
            currRes[message.id] = sendResponse;
            handleConnect(message, sender, sendResponse);
        } else if (message.method === "disconnect") {
            handleDisconnect(message, sender, sendResponse);
        }

        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "acbccnc") {
        currResNC[message.id] = sendResponse;
        launchPopup(
            {
                FileUrl: "CreateNftCollectionNotification.html",
                name: "collection",
                collectionDesc: message.collectionDesc,
                collectionName: message.collectionName,
                collectionUrl: message.collectionUrl,
                address: message.address,
            },
            message,
            sender,
            sendResponse
        );

        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "acbccn") {
        currResN[message.id] = sendResponse;

        launchPopup(
            {
                FileUrl: "CreateNftNotification.html",
                name: "nft",
                nftDesc: message.nftDesc,
                collectionName: message.collectionName,
                nftName: message.nftName,
                nftUrl: message.nftUrl,
                address: message.address,
            },
            message,
            sender,
            sendResponse
        );

        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "acbcsgt") {
        currResST[message.id] = sendResponse;
        launchPopup(
            {
                FileUrl: "SendSignTxnNotification.html",
                name: "SendSignTxn",
                func: message.func,
                args: message.args,
                type_args: message.type_args
            },
            message,
            sender,
            sendResponse
        );

        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "aebc") {
        if (message.status === 200) {

            chrome.storage.local.get(["whitelistedDomains", "address"], (response) => {
                const whitelistedDomains = response.whitelistedDomains;
                const walletAddress = response.address;

                if (whitelistedDomains) {
                    if (JSON.parse(whitelistedDomains)[message.origin]) {
                        if (!JSON.parse(whitelistedDomains)[message.origin].includes(walletAddress)) {
                            const addressList = JSON.parse(whitelistedDomains)[message.origin];
                            addressList.push(walletAddress)

                            const editedObject = JSON.parse(whitelistedDomains);
                            editedObject[message.origin] = addressList;

                            const objectToSet = {
                                whitelistedDomains: JSON.stringify(editedObject),
                            };

                            chrome.storage.local.set(objectToSet, (res) => {
                                const sendResp = currRes[message.id];
                                sendResp({
                                    method: "connected",
                                    id: message.id,
                                    address: walletAddress,
                                    status: 200
                                });
                                delete currRes[message.id];
                            });
                        }
                    }
                    else {

                        const editedObject = JSON.parse(whitelistedDomains);
                        editedObject[message.origin] = [walletAddress];

                        // console.log(editedObject)

                        const objectToSet = {
                            whitelistedDomains: JSON.stringify(editedObject),
                        };

                        chrome.storage.local.set(objectToSet, (res) => {
                            const sendResp = currRes[message.id];
                            sendResp({
                                method: "connected",
                                id: message.id,
                                address: walletAddress,
                                status: 200
                            });
                            delete currRes[message.id];
                        });

                    }
                } else {
                    const editedObject = {};
                    editedObject[message.origin] = [walletAddress];

                    // console.log(editedObject)

                    const objectToSet = {
                        whitelistedDomains: JSON.stringify(editedObject),
                    };

                    chrome.storage.local.set(objectToSet, (response) => {
                        const sendResp = currRes[message.id];
                        sendResp({
                            method: "connected",
                            id: message.id,
                            address: walletAddress,
                            status: 200
                        });
                        delete currRes[message.id];
                    });
                }
            });
        }
        else {
            const sendResp = currRes[message.id];
            sendResp({
                method: "connected",
                id: message.id,
                status: 4001
            });
            delete currRes[message.id];
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "aebccnc") {
        if (message.status === 200) {
            const CreateNFTCollWrapperFunc = async () => {

                try {
                    cacheAccount(message.code);
                    const txnHash = await nftBundle.createNFTCollection(
                        unlmne[0].account,
                        message.collectionName,
                        message.collectionDesc,
                        message.collectionUrl
                    );
                    // console.log(txnHash)

                    if (txnHash.vm_status.includes("COLLECTION_ALREADY_EXISTS")) {
                        const sendResp = currResNC[message.id];
                        sendResp({ status: -32603, id: message.id, message: "Collection is already published." });
                        delete currResN[message.id];
                    }
                    else {
                        const sendResp = currResNC[message.id];
                        sendResp({ status: 200, id: message.id, data: { txnHash: txnHash } });
                        delete currResN[message.id];
                    }

                    const sendResp = currResNC[message.id];
                    sendResp({ status: 200, id: message.id, data: { txnHash: txnHash } });
                    delete currResNC[message.id];

                } catch (e) {
                    // console.log(e)

                    if (e.toString().includes("INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE")) {
                        const sendResp = currResNC[message.id];
                        sendResp({ status: 4100, id: message.id });
                        delete currResNC[message.id];
                    }

                    else {
                        const sendResp = currResNC[message.id];
                        sendResp({ status: -32603, id: message.id });
                        delete currResNC[message.id];
                    }


                    return;
                }

            };
            CreateNFTCollWrapperFunc();
        } else {
            const sendResp = currResNC[message.id];
            sendResp({ status: 4001, id: message.id });
            delete currResNC[message.id];
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "aebccn") {
        if (message.status === 200) {
            const CreateNFTWrapperFunc = async () => {

                try {
                    cacheAccount(message.code);
                    const txnHash = await nftBundle.createNFT(
                        unlmne[0].account,
                        message.collectionName,
                        message.nftName,
                        message.nftDesc,
                        message.nftUrl
                    );

                    if (txnHash.vm_status.includes("ECOLLECTION_NOT_PUBLISHED")) {
                        const sendResp = currResN[message.id];
                        sendResp({ status: -32603, id: message.id, message: "Collection is not published." });
                        delete currResN[message.id];
                    }
                    else {
                        const sendResp = currResN[message.id];
                        sendResp({ status: 200, id: message.id, data: { txnHash: txnHash } });
                        delete currResN[message.id];
                    }




                } catch (e) {
                    // console.log(e)

                    if (e.toString().includes("INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE")) {
                        const sendResp = currResN[message.id];
                        sendResp({ status: 4100, id: message.id });
                        delete currResN[message.id];
                    }
                    else {
                        const sendResp = currResN[message.id];
                        sendResp({ status: -32603, id: message.id });
                        delete currResN[message.id];
                    }

                    return;
                }

            };

            CreateNFTWrapperFunc();
        } else {
            const sendResp = currResN[message.id];
            sendResp({ status: 4001, id: message.id });
            delete currResN[message.id];
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "aebcsgt") {
        if (message.status === 200) {
            const SignTxnWrapperFunc = async () => {

                let txnHash;

                try {
                    cacheAccount(message.code);
                    txnHash = await aptosUtility.signGenericTransaction(
                        unlmne[0].account,
                        message.func,
                        message.args,
                        message.type_args
                    );
                    // console.log(txnHash)

                } catch (e) {

                    if (e.toString().includes("INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE")) {
                        const sendResp = currResST[message.id];
                        sendResp({ status: 4100, id: message.id });
                        delete currResST[message.id];
                    }
                    else {
                        const sendResp = currResST[message.id];
                        sendResp({ status: -32603, id: message.id });
                        delete currResST[message.id];
                    }

                    return;
                }

                const sendResp = currResST[message.id];
                sendResp({ status: 200, id: message.id, data: { txnHash: txnHash } });
                delete currResST[message.id];
            };

            SignTxnWrapperFunc();
        } else {
            const sendResp = currResST[message.id];
            sendResp({ status: 4001, id: message.id });
            delete currResST[message.id];
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "apcine") {

        try {
            chrome.storage.local.get(['address'], async (resp) => {
                const walletAddress = resp.address

                const bal = await aptosUtility.getBalance(walletAddress);
                sendResponse({ status: 200, data: bal });

                return true;
            })
        }
        catch (e) {
            // console.log(e)
            sendResponse({ status: -32603 });
            return true;
        }
        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "apsevnt") {
        try {
            chrome.storage.local.get(['address'], async (resp) => {
                const walletAddress = resp.address

                const data = await aptosUtility.getSentActivity(walletAddress);
                sendResponse({ status: 200, data: data });

                return true;
            })
        }
        catch (e) {
            // console.log(e)
            sendResponse({ status: -32603 });
            return true;
        }
        return true;
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.channel === "aprevnt") {
        try {
            chrome.storage.local.get(['address'], async (resp) => {
                const walletAddress = resp.address

                const data = await aptosUtility.getReceivedActivity(walletAddress);
                sendResponse({ status: 200, data: data });

                return true;
            })
        }
        catch (e) {
            // console.log(e)
            sendResponse({ status: -32603 });
            return true;
        }
        return true;
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.channel === "aemc") {
        chrome.storage.local.get("connectedTabIds", (result) => {
            const connectedTabIds = result.connectedTabIds;

            if (connectedTabIds) {
                const parsedObject = JSON.parse(connectedTabIds);
                const editedList = Object.values(parsedObject.value);

                const ChangedList = [];

                editedList.forEach((item, ind) => {
                    chrome.tabs.get(parseInt(item), (tab) => {
                        if (tab) {
                            ChangedList.push(parseInt(item));
                        } else {
                            editedList.splice(ind, 1);
                        }

                        if (ind === Object.values(parsedObject.value).length - 1) {
                            const stringifiedList = JSON.stringify({ value: editedList });
                            chrome.storage.local.set({ connectedTabIds: stringifiedList });
                        }
                    });
                });
            }
        });


        if (message.method === "set") {
            if (typeof message.data === "string") {
                cacheAccount(message.data);
            } else {
                unlmne = [message.data, new Date().getTime() + timeout * 60000];
            }
        } else if (message.method === "get") {
            if (unlmne.length === 2) {
                if (unlmne[1] >= new Date().getTime()) {
                    sendResponse(unlmne[0]);
                } else {
                    sendResponse(null);
                }
            } else {
                sendResponse(null);
            }
        }

        return true;
    }

});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.channel === "aelw") {

        unlmne = []

        sendResponse(200)

        return true;
    }

});