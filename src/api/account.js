import { WalletClient } from "@martiandao/aptos-web3-bip44.js";

const apis = new WalletClient("https://fullnode.devnet.aptoslabs.com", "https://faucet.devnet.aptoslabs.com")

export const getAccountFromMetadata = async (code, metadata) => {
    const account = await apis.getAccountFromMetaData(code, metadata)
    return account
}

export const rotateAuthkey = async (code, metadata) => {
    const data = await apis.rotateAuthKey(code, metadata)
    return data
}

export const importAccount = async (code) => {
    const wallet = await apis.importWallet(code);
    return wallet;
};

export const createNewAccount = async (code) => {
    const wallet = await apis.createNewAccount(code);
    return wallet;
};

export const getBalance = async (address) => {
    const balance = await apis.getBalance(address);
    return balance;
};

export const airdrop = async (code, amount) => {
    await apis.airdrop(code, amount);
};

export const transferAmount = async (account, address, amount) => {
    console.log(account)
    await apis.transfer(account, address, amount);
};
export const getSentActivity = async (address) => {
    const sentEvents = await apis.getSentEvents(address);
    return sentEvents;
};
export const getReceivedActivity = async (address) => {
    const receivedEvents = await apis.getReceivedEvents(address);
    return receivedEvents;
};
export const createCollection = async (
    acount,
    collectionName,
    collectionDesc,
    collectionUrl
) => {
    await apis.createCollection(
        acount,
        collectionName,
        collectionDesc,
        collectionUrl
    );
};
export const createNft = async (
    acount,
    collectionName,
    NftName,
    NftDesc,
    NftUrl
) => {
    await apis.createToken(acount, collectionName, NftName, NftDesc, 1, NftUrl);
};

export const getAccountTokens = async (address) => {
    const tokens = await apis.getTokens(address)
    return tokens;
};

export const registerCoin = async (account, address) => {
    const tokens = await apis.registerCoin(account, address)
    return tokens;
};
export const transferCoin = async (account, coinAddress, destAddress, amount) => {
    const tokens = await apis.transferCoin(account, coinAddress, destAddress, amount)
    return tokens;
};
export const getCoinBalance = async (address, coinAddress) => {
    const balance = await apis.getCoinBalance(address, coinAddress)
    return balance;
};
