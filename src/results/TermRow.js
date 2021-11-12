import { useState } from "react";
import MainRow from "./MainRow";
import AltRow from "./AltRow";

function Row(props) {
    const [editedCell, setEditedCell] = useState(null);
    const [mainRowIndex, setMainRowIndex] = useState(0);
    const mainRow = props.rows[mainRowIndex];
    function endEdit(e) {
        e.stopPropagation();
        setEditedCell(null);
    }

    function makeAltRows() {
        return props.rows.map((row, index) =>
            index !== mainRowIndex ? (
                <AltRow
                    key={index}
                    row={row}
                    setMain={e => {
                        setMainRowIndex(index);
                        endEdit(e);
                    }}
                />
            ) : null
        );
    }

    return (
        <>
            <MainRow
                row={mainRow}
                setAsEdited={props.setAsEdited}
                removeAsEdited={props.removeAsEdited}
                approvedViaMod={props.approvedViaMod}
                endEdit={endEdit}
                editedCell={editedCell}
                setEditedCell={setEditedCell}
                setStatus={props.setStatus}
            />
            {editedCell === "View Alternate Mappings" ? makeAltRows() : null}
        </>
    );
}

export default Row;
