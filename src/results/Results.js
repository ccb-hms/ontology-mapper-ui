import React from "react";
import Papa from "papaparse";

let data = [];

fetch("small.csv")
    .then(response => {
        const reader = response.body.getReader();
        return reader.read();
    })
    .then(result => {
        const decoder = new TextDecoder("utf-8");
        return decoder.decode(result.value);
    })
    .then(result =>
        // https://stackoverflow.com/a/61420376
        Papa.parse(result, {
            header: true,
            step: function(result) {
                data.push(result.data);
            },
            complete: function(results, file) {
                console.log("parsing complete");
            },
        })
    );

function createRow(row) {
    let rowData = [];
    for (const property in row) {
        rowData.push(<td>{row[property]}</td>);
    }
    return <tr>{rowData}</tr>;
}

export function Results() {
    return (
        <div>
            <table>
                <tbody>{data.map(createRow)}</tbody>
            </table>
        </div>
    );
}

export function Home() {
    return <div>This is the home page!</div>;
}
