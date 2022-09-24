import ReactTooltip from "react-tooltip";

function Tooltip({ tip }) {
    return (
        <>
            <span data-tip={tip}> ⓘ:</span>
            <ReactTooltip
                place="top"
                effect="float"
                backgroundColor="#6c757d"
            />
        </>
    );
}

export default Tooltip;
