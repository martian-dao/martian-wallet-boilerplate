import React from 'react'

export default function InfoBar({ ShowInfo }) {
    return (
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
            boxShadow: ShowInfo
                ? ShowInfo[1] === "success"
                    ? "rgb(0 255 163 / 35%) 6px 4px 18px, rgb(6 109 66 / 15%) -15px 0px 31px inset, rgb(8 210 137 / 30%) 15px 0px 40px"
                    : null : null,
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
    )
}
