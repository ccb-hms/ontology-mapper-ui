import { useState } from "react";
import "./Form.css";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUrlBase from "./UrlBase.js";

function ResultsForm() {
    const navigate = useNavigate();
    const [csv, setCsv] = useState([]);
    const [termGraphsJson, setTermGraphsJson] = useState([]);

    // api information
    const URL_BASE = getUrlBase();
    const url_submit = URL_BASE + "/api/old_results";

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append("csv", csv[0].file);
        formData.append("term_graphs_json", termGraphsJson[0].file);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios.post(url_submit, formData, config).then((response) => {
            navigate("/results/", {
                state: { processId: response.data },
            });
        });
    }

    // uses Bootstrap grid system
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="ft-upload-area">
                    <div className="ft-upload-block" style={{ gridColumn: 1 }}>
                        <h3 className="center-text">{"Results CSV"}</h3>
                        <Dropzone
                            onChange={setCsv}
                            value={csv}
                            accept={".csv"}
                            behavior="replace"
                            label={
                                "Drag .csv file of old results here or click to browse computer."
                            }
                            maxFiles={1}
                            minHeight={0}
                        >
                            {csv.map((file) => (
                                <FileItem {...file} key={1} preview />
                            ))}
                        </Dropzone>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="ft-upload-block" style={{ gridColumn: 3 }}>
                        <h3 className="center-text">{"Ontology Graph JSON"}</h3>
                        <Dropzone
                            onChange={setTermGraphsJson}
                            value={termGraphsJson}
                            accept={".json"}
                            behavior="replace"
                            label={
                                "Drag .json file of ontology graphs here or click to browse computer."
                            }
                            maxFiles={1}
                            minHeight={0}
                        >
                            {termGraphsJson.map((file) => (
                                <FileItem {...file} key={1} preview />
                            ))}
                        </Dropzone>
                    </div>
                </div>
                {csv.length > 0 && termGraphsJson.length > 0 && (
                    <div className="center-btn">
                        <input
                            type="submit"
                            className="bold btn btn-secondary"
                        />
                    </div>
                )}
            </form>
        </div>
    );
}

export default ResultsForm;
