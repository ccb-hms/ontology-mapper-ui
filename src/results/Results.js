import { useState, useEffect } from "react";
import { default as _ } from "lodash";
import { CSVLink } from "react-csv";

import TermRows from "./TermRows";

const table_columns = [
    "Source Term",
    "Mapped Term Label",
    "Score",
    "Ontology",
    "Mapping Type",
    "View Alternate Mappings",
    "Approve or Reject Mappings",
];

const csv_headers = _.map(
    [
        "Source Term",
        "Mapped Term Label",
        "Mapped Term Identifier",
        "Score",
        "Mapping Type",
        "Status",
    ],
    t => ({ label: t, key: _.snakeCase(t) })
);

export default function Results(props) {
    function initialData() {
        // extract the identifier from the URL

        // set up data to be grouped by source term and have additional fields
        const grouped = _.groupBy(
            _.map(props.data, row => {
                const mti = new URL(row.mapped_term_identifier).pathname;
                const id = mti.slice(_.lastIndexOf(mti, "/") + 1);
                return {
                    ...row,
                    status: "unapproved",
                    mapping_type: "exact",
                    id: id,
                };
            }),
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
    // get source terms in order they appeared in original output
    const sourceTerms = _.uniq(_.map(props.data, "source_term"));

    function changeField(source_term, index, field, value) {
        // for the index'ed row of source_term, change the value of field
        setData({
            ...data,
            [source_term]: _.map(data[source_term], (row, i) =>
                i === index ? { ...row, [field]: value } : row
            ),
        });
    }

    function setSelected(source_term, index) {
        // for a source term, set the option at index to selected and all other options to unselected
        setData({
            ...data,
            [source_term]: _.map(data[source_term], (row, i) =>
                i === index
                    ? { ...row, selected: true }
                    : { ...row, selected: false }
            ),
        });
    }

    // keep track of the statuses for the stat descriptor at the top
    const [statusCounts, setStatusCounts] = useState({});

    useEffect(() => {
        // calculate the counts of each status option
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

    return (
        <div>
            <div>
                {`${sourceTerms.length} terms total; ${statusCounts.approved ||
                    0} approved, ${statusCounts.rejected ||
                    0} rejected, ${statusCounts.unapproved || 0} unapproved`}
            </div>
            <CSVLink
                data={_.filter(
                    _.flatMap(data, v => v),
                    "selected"
                )}
                headers={csv_headers}
                filename={"mapping-output.csv"}
            >
                Download
            </CSVLink>
            <table>
                <thead>
                    <tr>
                        {table_columns.map(c => (
                            <th key={c}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sourceTerms.map((term, i) => (
                        <TermRows
                            key={term}
                            rows={data[term]}
                            changeField={(i, field, value) =>
                                changeField(term, i, field, value)
                            }
                            setSelected={i => setSelected(term, i)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
