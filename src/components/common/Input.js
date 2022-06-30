const inputStyles = {
    width: "100%",
    padding: "12px 8px",
    color: "white",
    fontSize: "1.2em",
    background: "#0F0F0F",
    border: "1px solid #4E4E4E",
    boxSizing: "border-box",
    boxShadow: "0px 4px 12px rgb(0 0 0 / 25%)",
    borderRadius: "4px",
    outline: "none"
};

const Input = ({ style = {}, ...props }) => {
    return <input style={{ ...inputStyles, ...style }} {...props} />;
};

export default Input;
