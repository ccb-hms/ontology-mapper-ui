import Async from "react-async";
import Results from "./Results";
import Papa from "papaparse";
import { default as _ } from "lodash";

export async function parseCsv(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => _.snakeCase(header),
            complete: (results) => {
                return resolve(results);
            },
            error: (error) => {
                return reject(error);
            },
        });
    });
}

async function getData() {
    const [csvResponse, jsonResponse] = await Promise.all([
        fetch("full.csv"),
        fetch("full-graphs.json"),
    ]);
    const [result, json] = await Promise.all([
        csvResponse.body.getReader().read(),
        jsonResponse.json(),
    ]);

    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);

    const data = (await parseCsv(csv)).data;

    // combine
    const combinedData = _.map(_.zip(data, json), ([d, j]) => ({
        ...d,
        graph: j,
    }));

    const maxCount = _.max(_.values(_.countBy(data, "source_term")));
    return { data: combinedData, maxCount: maxCount };
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
