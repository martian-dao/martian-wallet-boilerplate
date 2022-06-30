import React, { useEffect, useState } from 'react';
import { getCoinBalance } from '../api/account';

export default function CoinListItem({ address, CoinAddress, name }) {

    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        getCoinBalance(address, CoinAddress)
            .then((res) => {
                setBalance(res);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log({ err });
            });
    }, []);

    return (
        <div
            className="flex justify-between items-center w-full border-box text-white"
            style={{
                padding: "10px 15px",
                margin: "10px 0px",
                background: "linear-gradient(103.69deg, rgba(255, 255, 255, 0.18) -40.6%, rgba(255, 255, 255, 0.05) 103.61%)",
                border: "1px solid #3C3C3C",
                backdropFilter: "blur(20px)",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer"
            }}
        >
            <div className="flex flex-row justify-center items-center">
                <span style={{ margin: "0px 4px" }}>{name}</span>
            </div>
            {
                isLoading
                    ? <div id="loader"></div>
                    : <p style={{ margin: "0" }}>{balance}</p>
            }

        </div>
    )
}
