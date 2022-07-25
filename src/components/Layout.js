import "./Layout.css";
import NavBar from "./NavBar";
export default function Layout(props) {
    return (
        <div className="App">
            <div className="Header">
                <div>
                    <h1>text2term ontology mapper</h1>
                    <h6>
                        A tool for mapping free-text term descriptions to terms from an arbitrary ontology.
                    </h6>
                </div>
                <NavBar currentPath={props.currentPath} />
            </div>
            <hr />
            {props.content}
        </div>
    );
}
