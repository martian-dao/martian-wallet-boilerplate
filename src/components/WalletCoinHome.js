import { useEffect, useState } from 'react';
import { getCoinBalance, transferCoin } from '../api/account';
import Button from '../components/common/Button';
import InfoBar from '../components/common/InfoBar';
import { useAuth } from '../context/auth';

const WalletCoinHome = ({ setIsCoinPage, isCoinPage }) => {
    const { account } = useAuth();

    const [balance, setBalance] = useState(0);

    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");

    const [ShowInfo, setShowInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCoinBalance(account.address, isCoinPage[1])
            .then((res) => {
                setBalance(res);
            })
            .catch((err) => {
                console.log({ err });
            });
    }, [isLoading]);

    const handleTransaction = async (destAddress, amount) => {
        setIsLoading(true);

        transferCoin(account.account, isCoinPage[1], destAddress, amount)
            .then((res) => {
                setShowInfo([`${amount} ${isCoinPage[0]} sent successfully`, "success"])
                setTimeout(() => {
                    setShowInfo(null)
                }, 2000);
            })
            .catch((e) => {
                console.error(e)
                setShowInfo([`${amount} ${isCoinPage[0]} sending failed`, "error"])
                setTimeout(() => {
                    setShowInfo(null)
                }, 2000)
            }
            )
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleBack = () => {
        setIsCoinPage(null)
    }

    return (
        <>
            <InfoBar ShowInfo={ShowInfo} />

            <div className="page-content flex flex-col justify-start items-center" style={{ flex: 1 }}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                }}
                >
                    <svg
                        onClick={handleBack}
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="none"
                        viewBox="0 0 14 14"
                        style={{ padding: "8px", borderRadius: "50%", background: "#0F0F0F", width: "15px", height: "15px", }}
                    >
                        <path fill="#07D585" d="M13.203 6.3H2.487l4.322-4.323a.7.7 0 0 0-.99-.99L.3 6.503a.703.703 0 0 0 0 .99l5.52 5.52a.7.7 0 0 0 .99-.99L2.487 7.698h10.716a.7.7 0 1 0 0-1.4V6.3Z"></path>
                    </svg>

                    <p
                        style={{
                            color: "white", margin: "0", fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "18px", marginLeft: "10px",
                        }}
                    >
                        Back to wallet
                    </p>
                </div>

                <div style={{
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "4px",
                    margin: "12px 0px",
                    padding: "10px 0px"
                }}>

                    <div className="flex flex-col items-center" style={{ flex: 0.35, margin: '0px' }}>
                        <h1 className="text-green" style={{ fontSize: '3em', margin: '0px' }}>
                            {balance}
                        </h1>
                        <div className="flex" style={{ margin: '4px 0', fontSize: '17px' }}>
                            <span className="text-lightgray">{isCoinPage[0]}</span>
                        </div>
                    </div>

                </div>

                <div style={{ width: "100%", margin: "10px 0px" }}>

                    <div className="flex flex-row justify-between" style={{ marginBottom: "5px", fontSize: "15px", padding: "0px 7px" }}>
                        <p className="text-lightgray" style={{ margin: "0" }}>Amount</p>
                    </div>

                    <div
                        className="flex justify-between items-center w-full border-box"
                        style={{
                            padding: "5px 10px",
                            background: "#0F0F0F",
                            border: "1px solid #4E4E4E",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
                            borderRadius: "4px"
                        }}
                    >
                        <input
                            className="numberInp text-white border-box flex flex-row justify-center items-center"
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value) }}
                            style={{ height: "33px", border: "none", background: "#0F0F0F", paddingRight: "15px", width: "100%", fontSize: "15px", outline: "none" }}
                        />
                    </div>
                </div>


                <div style={{ width: "100%", margin: "10px 0px" }}>

                    <div className="flex flex-row justify-between" style={{ marginBottom: "5px", fontSize: "15px", padding: "0px 7px" }}>
                        <p className="text-lightgray" style={{ margin: "0" }}>Receiver’s address</p>
                    </div>

                    <div
                        className="flex justify-between items-center w-full border-box"
                        style={{
                            padding: "5px 10px",
                            background: "#0F0F0F",
                            border: "1px solid #4E4E4E",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
                            borderRadius: "4px"
                        }}
                    >
                        <input
                            className="text-white border-box flex flex-row justify-center items-center"
                            type="text"
                            value={address}
                            onChange={(e) => { setAddress(e.target.value) }}
                            placeholder="Enter address"
                            style={{ height: "33px", border: "none", background: "#0F0F0F", paddingRight: "15px", width: "100%", fontSize: "15px", outline: "none" }} />
                    </div>
                </div>

                <Button
                    styles={{ margin: "5px 0px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "auto" }}
                    onClick={() => handleTransaction(address, amount)}
                    disabled={isLoading}
                >
                    Execute Transaction
                    {isLoading && <div id="loader"></div>}
                </Button>

            </div>
        </>
    );
};

export default WalletCoinHome;
