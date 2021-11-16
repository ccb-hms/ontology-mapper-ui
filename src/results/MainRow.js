import MappingType from "./MappingType";
import ApproveReject from "./ApproveReject";
import Ontology from "./Ontology";

function MainRow(props) {
    const row = props.row;
    return (
        <tr key={row["Mapped Term Identifier"]}>
            <td key="Source Term">{row["Source Term"]}</td>
            <td key="Mapped Term Label">{row["Mapped Term Label"]}</td>
            <td key="Mapped Term Identifier">
                {row["Mapped Term Identifier"]}
            </td>
            <td key="Score">{parseFloat(row["Score"]).toFixed(3)}</td>
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
