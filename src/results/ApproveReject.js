import { useState } from "react";
import { default as _ } from "lodash";

function ApproveReject(props) {
    const [value, setValue] = useState("unapproved");
    return (
        <td key="Approve Reject" onClick={props.setEdit}>
            {props.edited ? (
                <div>
                    <select
                        name="approve-reject"
                        defaultValue={value}
                        onChange={e => setValue(e.target.value)}
                    >
                        <option value="unapproved">Unapproved</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button
                        onClick={e => {
                            props.endEdit(e);
                            props.setStatus(value);
                        }}
                    >
                        Done
                    </button>
                </div>
            ) : (
                <span>{_.capitalize(value)}</span>
            )}
        </td>
    );
}

export default ApproveReject;
