window.addEventListener('changeAddress', (event) => {
    window.aptos.address = event.detail.address;
});

window.aptos = {
    connect: (cb) => {

        const id = Math.floor(Math.random() * (10 - 1) + 1)

        const listener = (event) => {

            if (parseInt(event.detail.id) === id) {
                window.removeEventListener('acc', listener);

                if (event.detail.status === 200) {

                    window.aptos.isConnected = true;
                    window.aptos.address = event.detail.address;

                    if (cb) {
                        cb({ status: 200, message: "Wallet was connected successfully.", address: event.detail.address })
                    }
                }
                else if (event.detail.status === 4001) {
                    cb({ status: 4001, message: "The user rejected the request through Martian wallet." })
                }
                else {
                    cb({ status: -32603, message: "Something went wrong within Martian wallet." })
                }
            }
        };
        window.addEventListener('acc', listener);

        window.dispatchEvent(
            new CustomEvent('aisc', { detail: { id: id } }),
        );

    },
    createNFTCollection: (collectionName, collectionDesc, collectionUrl, address, cb) => {
        const id = Math.floor(Math.random() * (10 - 1) + 1)

        const listener = (event) => {

            window.removeEventListener('accnc', listener);

            if (event.detail.status === 200) {
                cb({ status: 200, message: "NFT collection is created successfully.", data: event.detail.data })
            }
            else if (event.detail.status === 4001) {
                cb({ status: 4001, message: "The user rejected the request through Martian wallet." })
            }
            else if (event.detail.status === 4100) {
                cb({ status: 4100, message: "Insufficient balance for Gas fee." })
            }
            else {
                if (event.detail.message) {
                    cb({ status: -32603, message: event.detail.message })
                }
                else {
                    cb({ status: -32603, message: "Something went wrong within Martian wallet." })
                }
            }
        };
        window.addEventListener('accnc', listener);

        window.dispatchEvent(
            new CustomEvent(
                'aiscnc',
                {
                    detail: {
                        id: id,
                        collectionDesc: collectionDesc,
                        collectionName: collectionName,
                        collectionUrl: collectionUrl,
                        address: address
                    }
                }
            ),
        );

    },
    createNFT: (collectionName, nftName, nftDesc, nftUrl, address, cb) => {


        const id = Math.floor(Math.random() * (10 - 1) + 1)

        const listener = (event) => {

            window.removeEventListener('accn', listener);
            if (event.detail.status === 200) {
                cb({ status: 200, message: "NFT is minted successfully.", data: event.detail.data })
            }
            else if (event.detail.status === 4001) {
                cb({ status: 4001, message: "The user rejected the request through Martian wallet." })
            }
            else if (event.detail.status === 4100) {
                cb({ status: 4100, message: "Insufficient balance for Gas fee." })
            }
            else {
                if (event.detail.message) {
                    cb({ status: -32603, message: event.detail.message })
                }
                else {
                    cb({ status: -32603, message: "Something went wrong within Martian wallet." })
                }
            }
        };
        window.addEventListener('accn', listener);

        window.dispatchEvent(
            new CustomEvent(
                'aiscn',
                {
                    detail: {
                        id: id,
                        collectionName: collectionName,
                        nftDesc: nftDesc,
                        nftName: nftName,
                        nftUrl: nftUrl,
                        address: address,
                    }
                }
            ),
        );

    },
    signGenericTransaction: (func, args, type_arguments, cb) => {

        const id = Math.floor(Math.random() * (10 - 1) + 1)

        const listener = (event) => {

            window.removeEventListener('acsgt', listener);
            if (event.detail.status === 200) {
                cb({ status: 200, message: "Transaction is Signed and Sent successfully.", data: event.detail.data })
            }
            else if (event.detail.status === 4001) {
                cb({ status: 4001, message: "The user rejected the request through Martian wallet." })
            }
            else if (event.detail.status === 4100) {
                cb({ status: 4100, message: "Insufficient balance for Transaction fee." })
            }
            else {
                cb({ status: -32603, message: "Something went wrong within Martian wallet." })
            }
        };
        window.addEventListener('acsgt', listener);

        window.dispatchEvent(
            new CustomEvent(
                'aissgt',
                {
                    detail: {
                        id: id,
                        func: func,
                        args: args,
                        type_args: type_arguments
                    }
                }
            ),
        );

    },
    getAccountBalance: (cb) => {

        const listener = (event) => {

            window.removeEventListener('gtcoins', listener);
            if (event.detail.status === 200) {
                cb({ status: 200, message: "Balance fetched successfully", data: event.detail.data })
            } else {
                cb({ status: -32603, message: "Unable to fetch balance" })
            }
        };
        window.addEventListener('gtcoins', listener);

        window.dispatchEvent(new CustomEvent('aipht'));
    },

    getSentEvents: (cb) => {

        const listener = (event) => {

            window.removeEventListener('gtsevent', listener);
            if (event.detail.status === 200) {
                cb({ status: 200, message: "Sent events fetched successfully", data: event.detail.data })
            } else {
                cb({ status: -32603, message: "Unable to fetch sent events" })
            }
        };
        window.addEventListener('gtsevent', listener);

        window.dispatchEvent(new CustomEvent('aipsvt'));
    },

    getReceivedEvents: (cb) => {

        const listener = (event) => {

            window.removeEventListener('gtrevent', listener);
            if (event.detail.status === 200) {
                cb({ status: 200, message: "Received events fetched successfully", data: event.detail.data })
            } else {
                cb({ status: -32603, message: "Unable to fetch received events" })
            }
        };
        window.addEventListener('gtrevent', listener);

        window.dispatchEvent(new CustomEvent('aiprvt',),);
    },
    disconnect: () => {
        window.aptos.isConnected = false;
        window.aptos.address = null;

        return (true)
    },
    isConnected: false,
    address: null

};