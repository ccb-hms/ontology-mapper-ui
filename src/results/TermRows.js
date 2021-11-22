import { useState } from "react";
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

    function resetEditedCell(e) {
        e.stopPropagation();
        setEditedCell(EditedCell.None);
    }

    return props.rows.map(
        (row, index) =>
            (editedCell === EditedCell.ViewAltMappings || row.selected) && (
                <tr key={row.id}>
                    <td key="source_term">{row.source_term}</td>
                    <td key="mapped_term_label">
                        <a href={row.mapped_term_identifier}>
                            <p>{row.mapped_term_label}</p>
                            <p>{`[${row.id}]`}</p>
                        </a>
                    </td>
                    <td key="score">{parseFloat(row.score).toFixed(3)}</td>
                    <OntologyCell />
                    <MappingTypeCell
                        selected={row.selected}
                        value={row.mapping_type}
                        edited={editedCell === EditedCell.MappingType}
                        setEdit={() => setEditedCell(EditedCell.MappingType)}
                        changeField={v =>
                            props.changeField(index, "mapping_type", v)
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
                        setSelected={e => {
                            props.setSelected(index);
                            resetEditedCell(e);
                        }}
                    />
                    <StatusCell
                        selected={row.selected}
                        value={row.status}
                        edited={editedCell === EditedCell.ApproveReject}
                        setEdit={() => setEditedCell(EditedCell.ApproveReject)}
                        changeField={v => props.changeField(index, "status", v)}
                        resetEditedCell={resetEditedCell}
                    />
                </tr>
            )
    );
}

export default TermRows;
