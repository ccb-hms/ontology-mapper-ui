export default function ViewAltMappingsCell(props) {
    return props.selected ? (
        <td onClick={props.toggleView} className="interact-td">
            {props.edited ? "Hide" : "View"}
        </td>
    ) : (
        <td className="dark-interact-td" onClick={(e) => props.setSelected(e)}>
            Select Mapping
        </td>
    );
}
