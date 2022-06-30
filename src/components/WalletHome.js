import { useEffect, useState } from "react";
import { getBalance, airdrop } from "../api/account";

import Button from "../components/common/Button";
import InfoBar from "../components/common/InfoBar";

import { useAuth } from "../context/auth";
import CoinListItem from "./CoinListItem";

const WalletHome = ({ setSelected, setCurrentIndex }) => {
  const { account } = useAuth();
  const [balance, setBalance] = useState(0);
  const [allCoins, setAllCoins] = useState([]);
  const [ShowInfo, setShowInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBalance(account.address)
      .then((res) => {
        setBalance(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [isLoading, account]);

  useEffect(() => {
    /* eslint-disable no-undef */
    chrome.storage.local.get(["registered_coins"], (response) => {
      if (response["registered_coins"]) {
        const parsedList = JSON.parse(response["registered_coins"]);
        setAllCoins(parsedList);
      }
    });
  }, [isLoading, account]);

  const handleDeposit = async () => {
    setIsLoading(true);

    airdrop(account.address, 5000)
      .then((res) => {
        setShowInfo(["Airdrop success of 5000 APTOS coins", "success"]);
        setTimeout(() => {
          setShowInfo(null);
        }, 2000);
      })
      .catch((e) => {
        console.error(e);
        setShowInfo(["Airdrop of 5000 APTOS coins Failed", "error"]);
        setTimeout(() => {
          setShowInfo(null);
        }, 2000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSend = () => {
    setCurrentIndex("send");
  };

  return (
    <>
      <InfoBar ShowInfo={ShowInfo} />

      <div
        className="page-content flex flex-col justify-start items-center"
        style={{ flex: 1 }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(20px)",
            borderRadius: "4px",
            margin: "12px 0px",
            padding: "10px 0px",
          }}
        >
          <div
            className="flex flex-col items-center"
            style={{ flex: 0.35, margin: "0px" }}
          >
            <h1
              className="text-green"
              style={{ fontSize: "3em", margin: "0px" }}
            >
              {balance}
            </h1>
            <div className="flex" style={{ margin: "4px 0", fontSize: "17px" }}>
              <span className="text-lightgray">APTOS COINS</span>
            </div>
          </div>
        </div>

        <div
          className="flex justify-center items-center w-full"
          style={{ flex: 0.2, margin: "5px 0" }}
        >
          <Button
            styles={{
              width: "100%",
              marginRight: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleDeposit}
            disabled={isLoading}
          >
            <img
              src="/images/recieved.svg"
              alt=" "
              style={{ marginRight: "10px", width: "15px", height: "15px" }}
            />
            Airdrop
            {isLoading && <div id="loader"></div>}
          </Button>
          <Button
            styles={{
              width: "100%",
              marginLeft: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            variant="outline"
            onClick={handleSend}
          >
            <img
              src="/images/sendGray.svg"
              alt=" "
              style={{ marginRight: "10px", width: "15px", height: "15px" }}
            />
            Send
          </Button>
        </div>

        <div
          className="flex justify-between items-center w-full border-box text-white"
          style={{
            padding: "10px 15px",
            margin: "10px 0px",
            background:
              "linear-gradient(103.69deg, rgba(255, 255, 255, 0.18) -40.6%, rgba(255, 255, 255, 0.05) 103.61%)",
            border: "1px solid #07D585",
            backdropFilter: "blur(20px)",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          <div className="flex flex-row justify-center items-center">
            <img
              src="/images/aptos.svg"
              alt="aptos"
              width="32px"
              height="32px"
            />
            <span style={{ margin: "0px 4px" }}>Aptos</span>
          </div>
          <p style={{ margin: "0" }}>{balance}</p>
        </div>

        {allCoins.length > 0 ? (
          <div
            className="w-full flex flex-col justfy-start items-center"
            style={{ marginTop: "15px" }}
          >
            <p
              className="w-full text-lightgray"
              style={{ margin: "0px", fontSize: "14px" }}
            >
              All tokens
            </p>

            {allCoins.map((item) => {
              return (
                <CoinListItem
                  address={account.address}
                  CoinAddress={item[Object.keys(item)[0]]}
                  name={Object.keys(item)[0]}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default WalletHome;
