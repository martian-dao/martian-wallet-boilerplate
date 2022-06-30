import { useEffect, useState } from 'react';
import BottomNav from '../components/common/BottomNav';
import { useAuth } from '../context/auth';

import WalletHome from '../components/walletHome';
import WalletSend from '../components/WalletSend';

const Wallet = (props) => {
    const { account } = useAuth();

    const [ShowInfo, setShowInfo] = useState(null);
    const [currentIndex, setCurrentIndex] = useState("home");
    const [selected, setSelected] = useState(0);

    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [currentWebsiteName, setCurrentWebsiteName] = useState("");
    const [walletName, setWalletName] = useState(account.name);

    const [isSidebarActive, setIsSidebarActive] = useState(false);

    const address = account?.address
        ? account.address.slice(0, 4) + '...' + account.address.slice(-4)
        : '...';

    useEffect(() => {
        currentIndex === "home" && setSelected(0)

    }, [currentIndex])

    useEffect(() => {
        /* eslint-disable no-undef */
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

            const id = tabs[0].id
            const domain = tabs[0].url
            const ParsedURL = new URL(domain);
            console.log(ParsedURL)

            setCurrentWebsiteName(ParsedURL.hostname.replace("www.", ""))


            chrome.storage.local.get(["connectedTabIds", "whitelistedDomains"], (response) => {
                if (response.connectedTabIds) {
                    const parsedObj = JSON.parse(response.connectedTabIds);
                    const parsedDomains = JSON.parse(response.whitelistedDomains);

                    if (parsedDomains[ParsedURL.origin]) {
                        if (parsedDomains[ParsedURL.origin].includes(account.address)) {

                            if (
                                Object.values(parsedObj.value).includes(id.toString()) ||
                                Object.values(parsedObj.value).includes(id)
                            ) {
                                setIsWalletConnected(true)
                            }
                            else {
                                setIsWalletConnected(false)
                            }
                        }
                        else {
                            setIsWalletConnected(false)
                        }
                    }
                    else {
                        setIsWalletConnected(false)
                    }
                }
                else {
                    setIsWalletConnected(false)
                }

            });

        });
    }, [])

    useEffect(() => {
        setWalletName(account.name)
    }, [account.name])


    return (
        <div className="page page-login flex flex-col" {...props}>

            <div style={{ position: "absolute", width: "450px", height: "2px", top: "50px", background: "linear-gradient(270deg, #35F46B 0%, #09F0E2 100%)", opacity: "0.6" }}></div>

            <div className="page-header" style={{ justifyContent: "center" }}>

                <img onClick={() => setIsSidebarActive(!isSidebarActive)} alt="nav menu" src="/images/hamburger.svg" style={{
                    width: '22px',
                    height: '22px',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    marginLeft: "1rem",
                    cursor: "pointer"
                }} />

                <div className="flex flex-row justify-center items-center">
                    <p style={{ margin: "0", marginRight: "7px" }}>{walletName}</p>
                    <span
                        style={{ cursor: 'pointer' }}
                        title="Click to copy"
                        className="text-lightgray"
                        onClick={() => {
                            navigator.clipboard.writeText(account.address)
                            setShowInfo(["Address copied to clipboard", "success"]);
                            setTimeout(() => {
                                setShowInfo(null)
                            }, 2000)
                        }}
                    >
                        ({address})
                    </span>
                </div>

                <div
                    title={isWalletConnected ? `You are connected to ${currentWebsiteName}` : `You are not connected to ${currentWebsiteName}`}
                    style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor: isWalletConnected
                            ? "#02cf8d"
                            : "#F55757",
                        position: "absolute",
                        right: "20px"
                    }}
                >
                </div>
            </div>
            <div style={{
                position: "absolute",
                top: ShowInfo ? "46px" : "-60px",
                left: "0",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0px",
                zIndex: "100",
                background: ShowInfo
                    ? ShowInfo[1] === "success"
                        ? "linear-gradient(270deg, rgb(53, 244, 107) 0%, rgb(9, 240, 226) 100%)"
                        : ShowInfo[1] === "error"
                            ? "#F55757"
                            : null : null,
                boxShadow: "rgb(0 255 163 / 35%) 6px 4px 18px, rgb(6 109 66 / 15%) -15px 0px 31px inset, rgb(8 210 137 / 30%) 15px 0px 40px",
                transition: "all 1s ease",
            }}>
                <p style={{
                    margin: "0",
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "15px",
                }}
                >{ShowInfo && ShowInfo[0]}</p>
            </div>

            {currentIndex === "home" && <WalletHome setCurrentIndex={setCurrentIndex} />}
            {currentIndex === "send" && <WalletSend setCurrentIndex={setCurrentIndex} />}

            <BottomNav
                selectedI={selected}
                setSelectedI={setSelected}
                setCurrentIndex={setCurrentIndex}
                styles={{
                    padding: "0px 16px",
                    marginTop: "auto",
                    background: "linear-gradient(103.69deg, rgba(255, 255, 255, 0.09) -40.6%, rgba(255, 255, 255, 0.025) 103.61%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "8px 8px 0px 0px",
                    position: "relative"
                }}
            />
        </div>
    );
};

export default Wallet;
