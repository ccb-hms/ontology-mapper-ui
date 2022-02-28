import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AsyncResults from "./components/AsyncResults";
import Home from "./Home";

function App() {
    const [currentTime, setCurrentTime] = useState(0);
    // useEffect(() => {
    //     fetch("/api/time")
    //         .then(res => res.json())
    //         .then(data => {
    //             setCurrentTime(data.time);
    //         });
    // });

    return (
        <div>
            {/*<p>The current time is {currentTime}.</p>*/}
            <nav>
                <Link to="/">Home</Link> {" | "}
                <Link to="/results">Results</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<AsyncResults />} />
            </Routes>
        </div>
    );
}

export default App;
