import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar({ currentPath }) {
    const paths = [
        { path: "/", name: "Run Mapper" },
        { path: "/upload-results", name: "Upload Old Results" },
    ];
    return (
        <div className="nav-bar">
            {paths.map((p) =>
                p.path !== currentPath ? (
                    <Link key={p.path} to={p.path}>
                        <h6>{p.name}</h6>
                    </Link>
                ) : (
                    <h6 key={p.path} className="current-page">
                        {p.name}
                    </h6>
                )
            )}
        </div>
    );
}

export default NavBar;
