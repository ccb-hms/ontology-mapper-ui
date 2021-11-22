import Async from "react-async";
import Results from "./Results";
import Papa from "papaparse";

async function getData() {
    const response = await fetch("small.csv");
    const result = await response.body.getReader().read();

    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    let data = [];
    // https://stackoverflow.com/a/61420376
    await Papa.parse(csv, {
        header: true,
        step: function(result) {
            data.push(result.data);
        },
        complete: function(results, file) {
            console.log("parsing complete");
        },
    });
    return data;
}

export default function AsyncResults() {
    return (
        <Async promiseFn={getData}>
            <Async.Pending>Loading...</Async.Pending>
            <Async.Fulfilled>{data => <Results data={data} />}</Async.Fulfilled>
            <Async.Rejected>
                {error => `Something went wrong: ${error.message}`}
            </Async.Rejected>
        </Async>
    );
}
