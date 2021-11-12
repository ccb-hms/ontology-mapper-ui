import { useState } from "react";
import { default as _ } from "lodash";

function MappingType(props) {
    const [value, setValue] = useState("exact");
    return (
        <td key="Mapping Type" onClick={props.setEdit}>
            {props.edited ? (
                <div>
                    <select
                        name="mapping-type"
                        defaultValue={value}
                        onChange={e => setValue(e.target.value)}
                    >
                        <option value="exact">Exact</option>
                        <option value="broad">Broad</option>
                        <option value="narrow">Narrow</option>
                    </select>
                    <button
                        onClick={e => {
                            props.endEdit(e);
                        }}
                    >
                        Done
                    </button>
                </div>
            ) : (
                <span className={value !== "exact" ? "edited" : ""}>
                    {_.capitalize(value)}
                </span>
            )}
        </td>
    );
}

export default MappingType;
