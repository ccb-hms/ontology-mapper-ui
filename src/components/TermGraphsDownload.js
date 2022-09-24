// https://dev.to/thomasfindlay/how-to-download-csv-and-json-files-in-react-18m6

const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
};

export default function TermGraphsDownload({ termGraphs }) {
    const exportToJson = (e) => {
        e.preventDefault();
        downloadFile({
            data: JSON.stringify(termGraphs),
            fileName: "term-graphs.json",
            fileType: "text/json",
        });
    };

    return (
        <button className="btn btn-secondary" onClick={exportToJson}>
            Download Term Graphs
        </button>
    );
}
