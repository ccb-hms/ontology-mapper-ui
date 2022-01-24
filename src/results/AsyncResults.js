import Async from "react-async";
import Results from "./Results";
import Papa from "papaparse";
import { default as _ } from "lodash";

async function getData() {
    const response = await fetch("full.csv");
    const result = await response.body.getReader().read();

    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    let data = [];
    // https://stackoverflow.com/a/61420376
    await Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => _.snakeCase(header),
        step: function (result) {
            data.push(result.data);
        },
        complete: function (results, file) {
            // figure out how many returned per row
            return;
        },
    });
    const maxCount = _.max(_.values(_.countBy(data, "source_term")));
    return { data: data, maxCount: maxCount };
}

export default function AsyncResults() {
    return (
        <Async promiseFn={getData}>
            <Async.Pending>Loading...</Async.Pending>
            <Async.Fulfilled>
                {(results) => <Results {...results} />}
            </Async.Fulfilled>
            <Async.Rejected>
                {(error) => `Something went wrong: ${error.message}`}
            </Async.Rejected>
        </Async>
    );
}
