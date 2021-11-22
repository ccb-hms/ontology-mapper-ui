import MappingType from "./MappingType";
import ApproveReject from "./ApproveReject";
import Ontology from "./Ontology";
import { default as _ } from "lodash";

function MainRow(props) {
    const row = props.row;
    const mdi = new URL(row.mapped_term_identifier).pathname;
    const id = mdi.slice(_.lastIndexOf(mdi, "/") + 1);
    return (
        <tr key={id}>
            <td key="Source Term">{row.source_term}</td>
            <td key="Mapped Term Label">
                <a href={row.mapped_term_identifier}>
                    <p>{row.mapped_term_label}</p>
                    <p>{`[${id}]`}</p>
                </a>
            </td>
            <td key="Score">{parseFloat(row.score).toFixed(3)}</td>
            <Ontology />
            <MappingType
                edited={props.editedCell === "Mapping Type"}
                setEdit={() => props.setEditedCell("Mapping Type")}
                endEdit={props.endEdit}
            />
            <td
                key="View Alternate Mappings"
                onClick={() =>
                    props.editedCell === "View Alternate Mappings"
                        ? props.setEditedCell(null)
                        : props.setEditedCell("View Alternate Mappings")
                }
            >
                {props.editedCell === "View Alternate Mappings"
                    ? "Hide"
                    : "View"}
            </td>
            <ApproveReject
                edited={props.editedCell === "Approve Reject"}
                setEdit={() => props.setEditedCell("Approve Reject")}
                endEdit={props.endEdit}
                setStatus={props.setStatus}
            />
        </tr>
    );
}

export default MainRow;
