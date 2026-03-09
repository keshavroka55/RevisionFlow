import { Link } from "react-router-dom";

function Navbar() {
    const linkStyle = { margin: "0 10px", textDecoration: "none", color: "blue" };

    return (
        <nav style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/test" style={linkStyle}>Test Page</Link>
            <Link to="/user" style={linkStyle}>User Page</Link>
        </nav>
    );
}

export default Navbar;
