import DropdownCell from "./DropdownCell";
import { default as _ } from "lodash";

export default function MappingTypeCell(props) {
    return props.selected ? (
        <DropdownCell
            options={["exact", "narrow", "broad"]}
            default={"exact"}
            edited={props.edited}
            setEdit={props.setEdit}
            changeField={v => props.changeField(v)}
            resetEditedCell={props.resetEditedCell}
            value={props.value}
        />
    ) : (
        <td>{_.capitalize(props.value)}</td>
    );
}
