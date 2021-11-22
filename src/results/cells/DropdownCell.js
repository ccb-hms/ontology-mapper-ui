import { default as _ } from "lodash";

export default function DropdownCell(props) {
    return (
        <td onClick={props.setEdit}>
            {props.edited ? (
                <div>
                    <select
                        name="mapping-type"
                        value={props.value}
                        onChange={e => props.changeField(e.target.value)}
                    >
                        {props.options.map(o => (
                            <option value={o} key={o}>
                                {_.capitalize(o)}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={e => {
                            props.resetEditedCell(e);
                        }}
                    >
                        Done
                    </button>
                </div>
            ) : (
                <span className={props.value !== props.default ? "edited" : ""}>
                    {_.capitalize(props.value)}
                </span>
            )}
        </td>
    );
}
