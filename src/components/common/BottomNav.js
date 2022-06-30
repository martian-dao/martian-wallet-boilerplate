import { useEffect, useState } from 'react';

const navBtnStyles = {
    width: '48px',
    height: '54px',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
};

const navIconStyles = {
    width: '27px',
    height: '27px',
};

const BottomNav = ({ setCurrentIndex, selectedI, setSelectedI, styles, ...props }) => {

    const handleClick = (index) => {
        setSelectedI(index);
        index === 0 && setCurrentIndex("home")
    };

    return (
        <div className="flex justify-between items-center" style={styles} {...props}>

            <div style={{
                position: "absolute",
                width: "40px",
                height: "5px",
                left: selectedI === 0 ? "20px" : selectedI === 1 ? "115px" : selectedI === 2 ? "205px" : selectedI === 3 ? "300px" : "-100px",
                top: "0px",
                background: "linear-gradient(270deg, #35F46B 0%, #09F0E2 100%)",
                borderRadius: "0px 0px 8px 8px",
                transition: "all 0.3s ease 0s",
            }}>
            </div>

            <div
                style={{ ...navBtnStyles, borderTop: 'none' }}
                onClick={() => handleClick(0)}
            >
                {
                    selectedI === 0
                        ? <img alt="nav menu" src="/images/walletHomeGreen.svg" style={navIconStyles} />
                        : <img alt="nav menu" src="/images/walletHome.svg" style={navIconStyles} />
                }
            </div>

        </div>
    );
};

export default BottomNav;
