const buttonStyles = {
    height: "40px",
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
};

const btnSolidStyles = {
    background: 'linear-gradient(270deg, #35F46B 0%, #09F0E2 100%)',
    boxShadow: "6px 4px 18px rgb(0 255 163 / 35%), inset -15px 0px 31px rgb(6 109 66 / 15%), inset 15px 7px 40px rgb(8 210 137 / 50%)"
};

const btnOutlineStyles = {
    color: '#CCCCCC',
    border: 'none',
    boxShadow: '4px 4px 20px rgb(129 129 129 / 10%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '4px',
    background: 'linear-gradient(103.69deg, rgba(255, 255, 255, 0.2) -40.6%, rgba(255, 255, 255, 0.08) 103.61%)'
};

const Button = ({ children, variant = 'solid', styles = {}, ...props }) => {

    let style = buttonStyles;
    if (variant === 'outline') {
        style = { ...style, ...btnOutlineStyles };
    } else {
        style = { ...style, ...btnSolidStyles };
    }

    return (
        <button className={variant === 'outline' ? "btn-outline" : "btn-solid"} style={{ ...style, ...styles }} {...props} >
            {children}
        </button>
    );
};

export default Button;
