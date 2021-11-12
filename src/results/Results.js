import { useState, useRef } from "react";
import Papa from "papaparse";
import TermRow from "./TermRow";
import { default as _ } from "lodash";
import { default as download } from "downloadjs";

let data = [];

async function getData() {
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
}
getData();

export function Results() {
    const columns = [
        "Source Term",
        "Mapped Term Label",
        "Mapped Term Identifier",
        "Score",
        "Ontology",
        "Mapping Type",
        "View Alternate Mappings",
        "Approve or Reject Mappings",
    ];

    const groupedData = _.groupBy(data, "Source Term");
    const sourceTerms = _.compact(
        _.map(_.uniqBy(data, "Source Term"), _.property("Source Term"))
    );

    let initialStatus = {};
    _.forEach(sourceTerms, term => {
        initialStatus[term] = "unapproved";
    });

    const [status, setStatus] = useState(initialStatus);

    const counts = _.countBy(status, v => v);

    const tableRef = useRef();

    function downloadTable() {
        const html = tableRef.current;
        let data = [];
        const rows = html.querySelectorAll("table tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [],
                cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) {
                if (j !== 4 && j !== 6) {
                    row.push(cols[j].innerText);
                }
            }
            data.push(row.join(","));
        }
        data = data.join("\n");
        download(data, "test-download.csv", "text/plain");
    }

    return (
        <div>
            <div>
                {`${sourceTerms.length} terms total; ${counts.approved ||
                    0} approved, ${counts.rejected ||
                    0} rejected, ${counts.unapproved || 0} unapproved`}
            </div>
            <button onClick={downloadTable}>Download</button>
            <table ref={tableRef}>
                <thead>
                    <tr>
                        {columns.map(c => (
                            <th key={c}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sourceTerms.map(term => (
                        <TermRow
                            key={term}
                            rows={groupedData[term]}
                            setStatus={value =>
                                setStatus({ ...status, [term]: value })
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
