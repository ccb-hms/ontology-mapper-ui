import DropdownCell from "./DropdownCell";
import { default as _ } from "lodash";

export default function ViewAltMappingsCell(props) {
    return props.selected ? (
        <td onClick={props.toggleView}>{props.edited ? "Hide" : "View"}</td>
    ) : (
        <td onClick={e => props.setSelected(e)}>Select Mapping</td>
    );
}
