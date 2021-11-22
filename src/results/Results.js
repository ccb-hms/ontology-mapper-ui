import { useState, useEffect, useRef } from "react";
import TermRow from "./TermRow";
import { default as _ } from "lodash";
import { default as download } from "downloadjs";

const columns = [
    "Source Term",
    "Mapped Term Label",
    "Score",
    "Ontology",
    "Mapping Type",
    "View Alternate Mappings",
    "Approve or Reject Mappings",
];

export default function Results(props) {
    function initialData() {
        const grouped = _.groupBy(
            _.map(props.data, row => ({ ...row, status: "unapproved" })),
            "source_term"
        );
        const selected = _.mapValues(grouped, group =>
            _.map(group, (row, i) =>
                i === 0
                    ? { ...row, selected: true }
                    : { ...row, selected: false }
            )
        );
        return selected;
    }
    const [data, setData] = useState(initialData());
    const sourceTerms = _.uniq(_.map(props.data, "source_term"));

    function changeField(source_term, index, field, value) {
        setData({
            ...data,
            [source_term]: _.map(data[source_term], (row, i) =>
                i === index ? { ...row, [field]: value } : row
            ),
        });
    }
    const [statusCounts, setStatusCounts] = useState({});
    useEffect(() => {
        setStatusCounts(
            _.countBy(
                _.compact(
                    _.flatMap(data, rows =>
                        _.map(rows, row => (row.selected ? row.status : null))
                    )
                ),
                v => v
            )
        );
    }, [data]);

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
                {`${sourceTerms.length} terms total; ${statusCounts.approved ||
                    0} approved, ${statusCounts.rejected ||
                    0} rejected, ${statusCounts.unapproved || 0} unapproved`}
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
                    {sourceTerms.map((term, i) => (
                        <TermRow
                            key={term}
                            rows={data[term]}
                            changeField={(field, value) =>
                                changeField(term, i, field, value)
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
