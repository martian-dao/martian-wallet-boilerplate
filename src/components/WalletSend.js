import { useState, useEffect } from 'react';
import { getBalance, transferAmount } from '../api/account';
import Button from '../components/common/Button';
import { useAuth } from '../context/auth';

const WalletSend = ({ setCurrentIndex }) => {
    const { account } = useAuth();
    const [ShowInfo, setShowInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const [amount, setAmount] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        getBalance(account.address)
            .then((res) => {
                setBalance(res);
            })
            .catch((err) => {
                console.log({ err });
            });
    }, [isLoading]);

    const handleTransaction = async (userAddress, amount) => {
        setIsLoading(true);

        transferAmount(account.account, userAddress, amount)
            .then((res) => {

                setShowInfo([`${amount} APT sent successfully`, "success", `https://explorer.devnet.aptos.dev/account/${userAddress}`])
                setTimeout(() => {
                    setShowInfo(null)
                }, 2000);
            })
            .catch((e) => {
                console.error(e)
                setShowInfo([`${amount} APT sending failed`, "error"])
                setTimeout(() => {
                    setShowInfo(null)
                }, 2000)
            }
            )
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <>
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
                    color: "#062c1d",
                    fontSize: "15px",
                }}>
                    {
                        ShowInfo && ShowInfo[0]
                    }
                    {
                        ShowInfo && ShowInfo[1] === "success" ? <a style={{ marginLeft: "10px", color: "black", fontWeight: "1000", textDecoration: "none" }} href={ShowInfo[2]} target="_blank">View status</a> : null
                    }
                </p>
            </div>
            <div className="page-content flex flex-col justify-start items-center" style={{ flex: 1 }}>

                <div style={{ width: "100%", margin: "10px 0px" }}>

                    <div className="flex flex-row justify-between" style={{ marginBottom: "5px", fontSize: "15px", padding: "0px 7px" }}>
                        <p className="text-lightgray" style={{ margin: "0" }}>Amount</p>
                        <p className="text-gray" style={{ margin: "0" }}>Balance: {balance}</p>
                    </div>

                    <div
                        className="flex justify-between items-center w-full border-box"
                        style={{
                            padding: "5px 10px",
                            margin: "16px 0px",
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
                            style={{ height: "33px", border: "none", background: "#0F0F0F", paddingRight: "15px", width: "100%", fontSize: "15px", outline: "none" }} />

                        <div
                            className="flex flex-row justify-center items-center"
                            style={{
                                padding: "4px 10px",
                                background: "linear-gradient(270deg, #35F46B 0%, #09F0E2 100%)",
                                boxShadow: "inset -15px 0px 31px rgba(6, 109, 66, 0.15), inset 15px 7px 40px rgba(8, 210, 137, 0.5)",
                                borderRadius: "2px"
                            }}
                        >
                            <img src="/images/aptos.svg" alt="aptos" width="25px" height="25px" />
                            <span className="font-bold text-black" style={{ marginLeft: "4px", fontSize: "14px" }}>APT</span>
                        </div>
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
                            margin: "16px 0px",
                            background: "#0F0F0F",
                            border: "1px solid #4E4E4E",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
                            borderRadius: "4px"
                        }}
                    >
                        <input
                            className="numberInp text-white border-box flex flex-row justify-center items-center"
                            type="text"
                            value={address}
                            onChange={(e) => { setAddress(e.target.value) }}
                            placeholder="Enter address"
                            style={{ height: "33px", border: "none", background: "#0F0F0F", paddingRight: "15px", width: "100%", fontSize: "15px", outline: "none" }} />
                    </div>
                </div>

                <div className="text-gray font-bold" style={{
                    marginTop: "20px",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}>
                    <Button
                        styles={{ margin: "5px 0px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        variant="outline"
                        onClick={() => setCurrentIndex("home")}
                    >
                        Close
                    </Button>

                    <Button
                        styles={{ margin: "5px 0px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleTransaction(address, amount)}
                        disabled={isLoading}
                    >
                        Execute Transaction
                        {isLoading && <div id="loader"></div>}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default WalletSend;
