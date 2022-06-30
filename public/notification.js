document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.hash.slice(1));
    const origin = urlParams.get('origin')
    const iconurl = urlParams.get("iconurl")
    const title = urlParams.get("title")
    const id = urlParams.get("id")


    const accountName = urlParams.get("accountName");
    const accountAddress = urlParams.get("accountAddress");

    const iconImg = document.getElementById("icon");
    const titleTag = document.getElementById("title");
    const urlTag = document.getElementById("url");
    const button = document.getElementById("connectBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const accountNameTag = document.getElementById("accountName");
    const accountAddressTag = document.getElementById("accountAddress");

    accountNameTag.innerText = accountName;
    accountAddressTag.innerText = "(" + accountAddress.slice(0, 4) + '...' + accountAddress.slice(-4) + ")";

    iconImg.src = iconurl;
    titleTag.innerText = title;
    urlTag.innerText = origin;

    button.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            channel: 'aebc',
            origin: origin,
            id: id,
            status: 200
        });
        setTimeout(() => {
            window.close()
        }, 500)
    })

    cancelBtn.addEventListener("click", () => {

        chrome.runtime.sendMessage({
            channel: 'aebc',
            id: id,
            status: 4001
        });
        setTimeout(() => {
            window.close()
        }, 500)
    })

})