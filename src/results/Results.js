import { useState, useEffect } from "react";
import { default as _ } from "lodash";
import { CSVLink } from "react-csv";

import "./bootstrap.min.css";
import "./Results.css";

import TermRows from "./TermRows";
import PageBar from "./PageBar";

const table_columns = [
    "#",
    "Source Term",
    "Mapped Term",
    "Score",
    "Ontology",
    "Mapping Type",
    "View Alternate Mappings",
    "Approve or Reject Mappings",
];

const csv_headers = _.map(
    [
        "",
        "Source Term",
        "Mapped Term Label",
        "Mapped Term Identifier",
        "Score",
        "Mapping Type",
        "Status",
    ],
    (t) => ({ label: t, key: _.snakeCase(t) })
);

export default function Results(props) {
    function initializeData() {
        // set up data to be grouped by source term and have additional fields
        const grouped = _.toPairs(
            _.groupBy(
                _.map(props.data, (row, i) => {
                    // extract the identifier from the URL
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
            )
        );
        const selected = _.map(grouped, (group, g) =>
            _.map(group[1], (row, i) => ({
                ...row,
                selected: i === 0,
                number: g + 1,
            }))
        );
        const sourceTerms = _.map(grouped, (group, g) => ({
            term: group[0],
            index: g,
        }));
        return [selected, sourceTerms];
    }
    const [initialData, sourceTerms] = initializeData();
    const [data, setData] = useState(initialData);
    const [pageNumber, setPageNumber] = useState(1);
    // get source terms in order they appeared in original output
    let currentSourceTerms = _.slice(
        sourceTerms,
        (pageNumber - 1) * 10,
        pageNumber * 10
    );

    function changeField(source_term_index, term_row_index, field, value) {
        // for the index'ed row of source_term, change the value of field
        let newData = _.concat(
            data.slice(0, source_term_index),
            [
                _.map(data[source_term_index], (row, i) =>
                    i === term_row_index ? { ...row, [field]: value } : row
                ),
            ],
            data.slice(source_term_index + 1)
        );
        setData(newData);
    }

    function setSelected(source_term_index, term_row_index) {
        // for a source term, set the option at index to selected and all other options to unselected
        let newData = _.concat(
            data.slice(0, source_term_index),
            [
                _.map(data[source_term_index], (row, i) => ({
                    ...row,
                    selected: i === term_row_index,
                })),
            ],
            data.slice(source_term_index + 1)
        );
        setData(newData);
    }

    // keep track of the statuses for the stat descriptor at the top
    const [statusCounts, setStatusCounts] = useState({});

    useEffect(() => {
        // calculate the counts of each status option
        setStatusCounts(
            _.countBy(
                _.compact(
                    _.flatMap(data, (rows) =>
                        _.map(rows, (row) => (row.selected ? row.status : null))
                    )
                ),
                (v) => v
            )
        );
    }, [data]);

    const pageBar = (
        <PageBar
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            maxPages={_.ceil(sourceTerms.length / 10)}
        />
    );

    return (
        <div>
            <p>
                <b>
                    {`${sourceTerms.length} terms total; ${
                        statusCounts.approved || 0
                    } approved, ${statusCounts.rejected || 0} rejected, ${
                        statusCounts.unapproved || 0
                    } unapproved`}
                </b>
            </p>
            <CSVLink
                className="btn btn-secondary"
                data={_.filter(
                    _.flatMap(data, (v) => v),
                    "selected"
                )}
                headers={csv_headers}
                filename={"mapping-output.csv"}
            >
                Download
            </CSVLink>
            {pageBar}
            <table className="table">
                <thead className="table-light">
                    <tr>
                        {table_columns.map((c) => (
                            <th
                                className={
                                    _.indexOf(
                                        [
                                            "#",
                                            "Source Term",
                                            "Mapped Term",
                                            "Score",
                                        ],
                                        c
                                    ) !== -1
                                        ? "fixed-th"
                                        : ""
                                }
                                key={c}
                            >
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentSourceTerms.map((t, i) => (
                        <TermRows
                            key={t.term}
                            rows={data[t.index]}
                            changeField={(i, field, value) =>
                                changeField(t.index, i, field, value)
                            }
                            setSelected={(i) => setSelected(t.index, i)}
                        />
                    ))}
                </tbody>
            </table>
            {pageBar}
        </div>
    );
}
