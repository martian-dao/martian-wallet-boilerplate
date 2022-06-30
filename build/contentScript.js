const container = document.head || document.documentElement;
const scriptTagInpage = document.createElement('script');
scriptTagInpage.setAttribute('async', 'false');
scriptTagInpage.src = chrome.runtime.getURL('inpage.js');
container.insertBefore(scriptTagInpage, container.children[0]);
container.removeChild(scriptTagInpage);

const fetchTitleIcon = (document) => {
    let iconUrl = document.querySelector("link[rel='apple-touch-icon']")
    if (iconUrl) {
        iconUrl = iconUrl.href;
    }
    else if (document.querySelector("link[rel='icon']")) {
        iconUrl = document.querySelector("link[rel='icon']").href;
    }

    let docTitle = document.querySelector("meta[property='og:title']")
    if (docTitle) {
        docTitle = docTitle.getAttribute("content");
    }
    else {
        docTitle = document.title;
    }
    return ({ iconUrl, docTitle })
}

window.addEventListener('aisc', (event) => {
    const fetchedData = fetchTitleIcon(document)

    chrome.runtime.sendMessage(
        {
            channel: 'acbc',
            method: "connect",
            id: event.detail.id,
            metainfo: { iconUrl: fetchedData.iconUrl, docTitle: fetchedData.docTitle }
        },
        (response) => {
            if (!response) {
                return;
            }

            chrome.storage.local.get('connectedTabIds', (result) => {

                const connectedTabIds = result.connectedTabIds;

                if (connectedTabIds) {

                    if (!Object.values(JSON.parse(connectedTabIds).value).includes(response.tabId.toString()) ||
                        !Object.values(JSON.parse(connectedTabIds).value).includes(response.tabId)) {

                        const PrevList = Object.values(JSON.parse(connectedTabIds).value)
                        PrevList.push(response.tabId)

                        const stringifiedList = JSON.stringify({ value: PrevList })

                        chrome.storage.local.set({ connectedTabIds: stringifiedList });

                    }
                }
                else {
                    const list = [];
                    list.push(response.tabId)
                    const stringifiedList = JSON.stringify({ value: list })

                    chrome.storage.local.set({ connectedTabIds: stringifiedList });

                }

            })

            window.dispatchEvent(
                new CustomEvent('acc', { detail: response }),
            );
        },
    );
});

window.addEventListener('aiscnc', (event) => {
    const fetchedData = fetchTitleIcon(document)

    chrome.runtime.sendMessage(
        {
            channel: 'acbccnc',
            id: event.detail.id,
            collectionDesc: event.detail.collectionDesc,
            collectionName: event.detail.collectionName,
            collectionUrl: event.detail.collectionUrl,
            address: event.detail.address,
            metainfo: { iconUrl: fetchedData.iconUrl, docTitle: fetchedData.docTitle }
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('accnc', { detail: response }),
            );
        },
    );
});

window.addEventListener('aiscn', (event) => {
    const fetchedData = fetchTitleIcon(document)

    chrome.runtime.sendMessage(
        {
            channel: 'acbccn',
            id: event.detail.id,
            collectionName: event.detail.collectionName,
            nftDesc: event.detail.nftDesc,
            nftName: event.detail.nftName,
            nftUrl: event.detail.nftUrl,
            address: event.detail.address,
            metainfo: { iconUrl: fetchedData.iconUrl, docTitle: fetchedData.docTitle }
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('accn', { detail: response }),
            );
        },
    );
});

window.addEventListener('aissgt', (event) => {
    const fetchedData = fetchTitleIcon(document)

    chrome.runtime.sendMessage(
        {
            channel: 'acbcsgt',
            id: event.detail.id,
            func: event.detail.func,
            args: event.detail.args,
            type_args: event.detail.type_args,
            metainfo: { iconUrl: fetchedData.iconUrl, docTitle: fetchedData.docTitle }
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('acsgt', { detail: response }),
            );
        },
    );
});

window.addEventListener('aipht', (event) => {

    chrome.runtime.sendMessage(
        {
            channel: 'apcine'
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('gtcoins', { detail: response }),
            );
        },
    );
});


window.addEventListener('aipsvt', (event) => {

    chrome.runtime.sendMessage(
        {
            channel: 'apsevnt'
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('gtsevent', { detail: response }),
            );
        },
    );
});

window.addEventListener('aiprvt', (event) => {

    chrome.runtime.sendMessage(
        {
            channel: 'aprevnt'
        },
        (response) => {
            if (!response) {
                return;
            }
            window.dispatchEvent(
                new CustomEvent('gtrevent', { detail: response }),
            );
        },
    );
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.subject === "changeAddress") {
        window.dispatchEvent(
            new CustomEvent('changeAddress', { detail: { address: message.data.address } }),
        );
    }
})