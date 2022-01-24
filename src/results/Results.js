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
        const selected = _.fromPairs(
            _.map(grouped, (group, g) => [
                group[0],
                _.map(group[1], (row, i) => ({
                    ...row,
                    selected: i === 0,
                    number: g + 1,
                })),
            ])
        );

        return selected;
    }

    const [data, setData] = useState(initializeData());
    const [pageNumber, setPageNumber] = useState(1);
    // get source terms in order they appeared in original output
    const sourceTerms = _.uniq(_.map(props.data, "source_term"));

    let currentSourceTerms = _.slice(
        sourceTerms,
        (pageNumber - 1) * 10,
        pageNumber * 10
    );

    function changeField(source_term, index, field, value) {
        // for the index'ed row of source_term, change the value of field
        console.log(source_term, index, field, value);
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
                    {currentSourceTerms.map((term, i) => (
                        <TermRows
                            key={term}
                            rows={data[term]}
                            changeField={(i, field, value) =>
                                changeField(term, i, field, value)
                            }
                            setSelected={(i) => setSelected(term, i)}
                        />
                    ))}
                </tbody>
            </table>
            {pageBar}
        </div>
    );
}
