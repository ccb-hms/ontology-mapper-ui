export default function PageBar({ pageNumber, maxPages, setPageNumber }) {
    return (
        <div>
            {pageNumber > 1 && (
                <button
                    className="btn btn-secondary"
                    onClick={() => setPageNumber(pageNumber - 1)}
                >
                    Previous Page
                </button>
            )}
            <span>Page </span>
            <input
                type="number"
                value={pageNumber}
                className="page-number-input"
                onChange={(e) => {
                    if (e.target.value >= 1 && e.target.value <= { maxPages }) {
                        setPageNumber(parseInt(e.target.value));
                    }
                }}
            ></input>
            <span> of {maxPages}</span>
            {pageNumber < maxPages && (
                <button
                    className="btn btn-secondary"
                    onClick={() => setPageNumber(pageNumber + 1)}
                >
                    Next Page
                </button>
            )}
        </div>
    );
}
