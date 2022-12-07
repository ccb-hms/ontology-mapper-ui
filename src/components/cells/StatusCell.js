import DropdownCell from "./DropdownCell";
import { default as _ } from "lodash";

export default function StatusCell(props) {
    return props.selected ? (
        <DropdownCell
            options={["unapproved", "approved", "compound"]}
            default={"unapproved"}
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
