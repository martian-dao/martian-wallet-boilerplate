/*global chrome*/
import { useState, useEffect } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/auth";
import { getAccountFromMetadata } from "../api/account";

const Login = (props) => {
    const [password, setPassword] = useState("");
    const [ShowInfo, setShowInfo] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const { setAuthAccount } = useAuth();

    useEffect(() => {
        chrome.runtime.sendMessage(
            {
                channel: "aemc",
                method: "get",
            },
            async (data) => {
                if (data) {
                    chrome.storage.local.get(["address", "accountMetadata"], async (response) => {
                        const account = await getAccountFromMetadata(data.code, response.accountMetadata[response.address])
                        const res = {
                            account: account,
                            address: response.address,
                            code: data.code,
                            name: response.accountMetadata[response.address].name
                        }
                        setAuthAccount(res);
                        setLoading(false);
                    });
                }
            }
        );

    }, []);

    const handleSubmit = () => {
        if (!password) {
            console.log("Not entered");
            setShowInfo(["Please Enter a Password", "error"])
            setTimeout(() => {
                setShowInfo(null);
            }, 2000);
        }

        setLoading(true);

        /* eslint-disable no-undef */
        chrome.storage.local.get(["locked"], async (resp) => {
            try {
                const decrypted = await security.loadMnemonic(password, resp.locked);
                /* eslint-disable no-undef */
                chrome.storage.local.get(["address", "accountMetadata"], async (response) => {
                    const account = await getAccountFromMetadata(decrypted.mnemonic, response.accountMetadata[response.address])

                    const res = {
                        account: account,
                        address: response.address,
                        code: decrypted.mnemonic,
                        name: response.accountMetadata[response.address].name
                    }
                    setAuthAccount(res);
                    setLoading(false);
                    chrome.runtime.sendMessage({
                        channel: "aemc",
                        method: "set",
                        data: decrypted.mnemonic
                    });
                });
            } catch (err) {
                console.log(err);
                console.log("wrong");
                setLoading(false);
                setShowInfo(["Incorrect password", "error"])
                setTimeout(() => {
                    setShowInfo(null);
                }, 2000);
            }
        });
    };

    return (
        <div className="page page-login flex flex-col" {...props} >

            <div style={{ position: "absolute", width: "450px", height: "2px", top: "50px", background: "linear-gradient(270deg, #35F46B 0%, #09F0E2 100%)", opacity: "0.6" }}></div>

            <div class="page-header text-green">
                <img src="/images/WhiteLogoHorizontal.svg" alt="martian" width="150px" height="29px" />
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
                transition: "all 1s ease",
                background: ShowInfo
                    ? ShowInfo[1] === "success"
                        ? "linear-gradient(270deg, rgb(53, 244, 107) 0%, rgb(9, 240, 226) 100%)"
                        : ShowInfo[1] === "error"
                            ? "#F55757"
                            : null : null,
                boxShadow: ShowInfo
                    ? ShowInfo[1] === "success"
                        ? "rgb(0 255 163 / 35%) 6px 4px 18px, rgb(6 109 66 / 15%) -15px 0px 31px inset, rgb(8 210 137 / 30%) 15px 0px 40px"
                        : ShowInfo[1] === "error"
                            ? "none"
                            : null : null,
            }}>
                <p style={{
                    margin: "0",
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "15px",
                }}
                >{ShowInfo && ShowInfo[0]}</p>
            </div>
            <div className="page-content flex flex-col justify-center items-center" style={{ flex: 1, maxHeight: "unset" }}>
                <div
                    className="flex flex-col justify-center items-center"
                    style={{ flex: 1, width: '100%' }}
                >
                    <img src="/images/aptos.svg" alt="aptos" width="80px" height="80px" style={{ border: "2px solid #02CF8D", borderRadius: "100%" }} />
                    <h3 style={{ margin: "25px 0px 15px", textAlign: "center", fontSize: "21px", fontWeight: "normal" }}>Enter your password</h3>
                    <Input
                        width="100%"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                handleSubmit()
                            }
                        }}
                    />
                </div>

                <Button
                    styles={{ marginTop: 'auto', width: '100%' }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    <img src="/images/lock.svg" width="12.5px" height="17.5px" style={{ marginRight: "5px" }} />
                    Unlock
                </Button>
            </div>
        </div>
    );
};

export default Login;