import { useState, useRef, Fragment } from "react";
import { default as _ } from "lodash";
import OntologyCell from "./cells/OntologyCell";
import MappingTypeCell from "./cells/MappingTypeCell";
import StatusCell from "./cells/StatusCell";
import ViewAltMappingsCell from "./cells/ViewAltMappingsCell";

export const EditedCell = {
    None: null,
    MappingType: "mapping_type",
    Ontology: "ontology",
    ViewAltMappings: "view_alternate_mappings",
    ApproveReject: "approve_reject",
};

function TermRows(props) {
    const [editedCell, setEditedCell] = useState(EditedCell.None);
    const ontologyRef = useRef(null);
    function resetEditedCell(e) {
        try {
            e.stopPropagation();
        } catch (e) {
        } finally {
            setEditedCell(EditedCell.None);
        }
    }

    const selected = _.filter(props.rows, "selected");
    const alts = _.filter(props.rows, (r) => !r.selected);

    return [...selected, ...alts].map(
        (row, index) =>
            (editedCell === EditedCell.ViewAltMappings || row.selected) && (
                <Fragment key={index}>
                    <tr className={!row.selected ? "alt-row" : ""}>
                        <td className="fixed-td" key="term_number">
                            {row.term_number}
                        </td>
                        <td className="fixed-td" key="source_term">
                            {row.source_term}
                        </td>
                        <td className="fixed-td" key="mapped_term_label">
                            <a href={row.mapped_term_iri}>
                                <p>{row.mapped_term_label}</p>
                                <p>{`[${row.id}]`}</p>
                            </a>
                        </td>
                        <td key="score" className="fixed-td">
                            {parseFloat(row.mapping_score).toFixed(3)}
                        </td>
                        <OntologyCell
                            edited={editedCell === EditedCell.Ontology}
                            setEdit={() => setEditedCell(EditedCell.Ontology)}
                            resetEditedCell={resetEditedCell}
                            reference={ontologyRef}
                            selected={row.selected}
                            graph={row.graph}
                            id={row.mapped_term_iri}
                            addNewTerm={(v) => props.addNewTerm(v)}
                        />
                        <MappingTypeCell
                            selected={row.selected}
                            value={row.mapping_type}
                            edited={editedCell === EditedCell.MappingType}
                            setEdit={() =>
                                setEditedCell(EditedCell.MappingType)
                            }
                            changeField={(v) =>
                                props.changeField(
                                    row.term_alt_number,
                                    "mapping_type",
                                    v
                                )
                            }
                            resetEditedCell={resetEditedCell}
                        />
                        <ViewAltMappingsCell
                            selected={row.selected}
                            edited={editedCell === EditedCell.ViewAltMappings}
                            toggleView={() =>
                                editedCell === EditedCell.ViewAltMappings
                                    ? setEditedCell(null)
                                    : setEditedCell(EditedCell.ViewAltMappings)
                            }
                            setSelected={(e) => {
                                props.setSelected(row.term_alt_number);
                                resetEditedCell(e);
                            }}
                        />
                        <StatusCell
                            selected={row.selected}
                            value={row.status}
                            edited={editedCell === EditedCell.ApproveReject}
                            setEdit={() =>
                                setEditedCell(EditedCell.ApproveReject)
                            }
                            changeField={(v) =>
                                props.changeField(
                                    row.term_alt_number,
                                    "status",
                                    v
                                )
                            }
                            resetEditedCell={resetEditedCell}
                        />
                    </tr>
                    {editedCell === EditedCell.Ontology && (
                        <tr>
                            <td
                                style={{ width: "100%" }}
                                colSpan="7"
                                ref={ontologyRef}
                            ></td>
                        </tr>
                    )}
                </Fragment>
            )
    );
}

export default TermRows;
