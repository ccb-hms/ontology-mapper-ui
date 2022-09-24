import { useState, useEffect } from "react";
import "./Form.css";
import ArgField from "./ArgField.js";
import FileTextUpload from "./FileTextUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { default as _ } from "lodash";
import getUrlBase from "./UrlBase.js";

function MapperForm() {
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [topMappings, setTopMappings] = useState(3);
    const [minScore, setMinScore] = useState(0.5);
    const [baseIRI, setBaseIRI] = useState("");
    const [inclDeprecated, setInclDeprecated] = useState(true);
    const [mapOption, setMapOption] = useState("tfidf");

    const [unstructuredTerms, setUnstructuredTerms] = useState(undefined);
    const [ontology, setOntology] = useState(undefined);
    const [currentStatus, setCurrentStatus] = useState(
        "Initializing mapper..."
    );
    const [processId, setProcessId] = useState(undefined);

    // api information
    const URL_BASE = getUrlBase();
    const url_mapper = URL_BASE + "/api/run_mapper";
    const url_status = URL_BASE + "/api/current_status";

    useEffect(() => {
        // while waiting for mapper to finish, ping current status endpoint

        const TIME_INTERVAL = 5000; // in ms
        let timer;

        function startTimer() {
            timer = setInterval(function () {
                axios
                    .get(url_status, { params: { processId: processId } })
                    .then((response) => {
                        setCurrentStatus(response.data);
                        const final = _.last(response.data.split("\n"));
                        if (final === "DONE") {
                            // when mapping complete; final line will be DONE
                            setWaiting(false);
                            stopTimer();
                            navigate("/results/", {
                                state: { processId: processId },
                            });
                        }
                    });
            }, TIME_INTERVAL);
        }

        function stopTimer() {
            clearInterval(timer);
        }
        if (waiting) {
            startTimer();
        }
    }, [waiting, navigate, url_status, processId]);

    const mainArgFields = [
        {
            name: "top_mappings",
            label: "Top Mappings",
            tip:
                "Maximum number of top-ranked mappings returned per source term.",
            field: (
                <input
                    type="number"
                    name="top_mappings"
                    value={topMappings}
                    onChange={(e) => setTopMappings(e.target.value)}
                />
            ),
        },
        {
            name: "min_score",
            label: "Minimum Score",
            tip:
                "Minimum score [0,1] for the mappings (0=dissimilar, 1=exact match).",
            field: (
                <input
                    type="number"
                    min={0}
                    max={1}
                    step={"any"}
                    name="min_score"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                />
            ),
        },
    ];

    const expandedArgFields = [
        {
            name: "base_iris",
            label: "Base IRIs",
            tip:
                "Map only to terms whose IRIs start with any IRI given in this comma-separated list.",
            field: (
                <input
                    type="text"
                    onChange={(e) => setBaseIRI(e.target.value)}
                    value={baseIRI}
                />
            ),
        },

        {
            name: "incl_deprecated",
            label: "Include Deprecated Terms",
            tip: "Include terms stated as deprecated via owl:deprecated.",
            field: (
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="incl_deprecated"
                    checked={inclDeprecated}
                    onChange={(e) => setInclDeprecated(!inclDeprecated)}
                />
            ),
        },
        {
            name: "mapper",
            label: "Mapper Options",
            tip: 
                "Method used to compare source terms with ontology terms.",
            field: (
                <select
                    type="text"
                    name="mapper"
                    onChange={(e) => setMapOption(e.target.value)}
                    value={mapOption}
                >
                <option value="levenshtein">Levenshtein</option>
                <option value="jaro">Jaro</option>
                <option value="jarowinkler">Jaro-Winkler</option>
                <option value="jaccard">Jaccard</option>
                <option value="fuzzy">Fuzzy</option>
                <option value="tfidf">tf-idf</option>
                <option value="zooma">Zooma</option>
                <option value="bioportal">Bioportal</option>
                </select>
            ),
        },
    ];

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        if (typeof unstructuredTerms === "string") {
            formData.append("unstructured_terms_text", unstructuredTerms);
        } else {
            formData.append(
                "unstructured_terms_file",
                unstructuredTerms[0].file
            );
        }

        if (typeof ontology === "string") {
            formData.append("ontology_text", ontology);
        } else {
            formData.append("ontology_file", ontology[0].file);
        }

        formData.append("top_mappings", topMappings);
        formData.append("min_score", minScore);
        formData.append("base_iris", baseIRI);
        formData.append("incl_deprecated", inclDeprecated);
        formData.append("mapper", mapOption);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        axios.post(url_mapper, formData, config).then((response) => {
            setProcessId(response.data);
            setWaiting(true);
        });
    }

    if (waiting) {
        return (
            <div className="waiting">
                {currentStatus.split("\n").map((line) => (
                    <p key={line}>{line}</p>
                ))}
                <div className="d-flex justify-content-center">
                    <div
                        className="spinner-border text-dark"
                        role="status"
                        style={{ width: "4rem", height: "4rem" }}
                    >
                        <span className="sr-only"></span>
                    </div>
                </div>
            </div>
        );
    }

    // uses Bootstrap grid system
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                {mainArgFields.map((d) => (
                    <ArgField {...d} key={d.name} />
                ))}
                {expanded &&
                    expandedArgFields.map((d) => (
                        <ArgField {...d} key={d.name} />
                    ))}
                <div className="center-btn">
                    {!expanded ? (
                        <div
                            className="bold btn btn-secondary"
                            onClick={() => setExpanded(true)}
                        >
                            ▼ Show More Options ▼
                        </div>
                    ) : (
                        <div
                            className="bold btn btn-secondary"
                            onClick={() => setExpanded(false)}
                        >
                            ▲ Show Fewer Options ▲
                        </div>
                    )}
                </div>
                <hr />
                <div className="ft-upload-area">
                    <FileTextUpload setOutput={setUnstructuredTerms} />
                    <div className="vertical-line"></div>
                    <FileTextUpload ontology={true} setOutput={setOntology} />
                </div>
                {unstructuredTerms && ontology && (
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

export default MapperForm;
