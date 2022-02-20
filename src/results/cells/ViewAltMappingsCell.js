export default function ViewAltMappingsCell(props) {
    if (props.disabled) return <td>-</td>;
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
