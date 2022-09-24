import { Dropzone, FileItem } from "@dropzone-ui/react";
import { useState, useEffect } from "react";

function FileTextUpload({ ontology, setOutput }) {
    const [display, setDisplay] = useState("both");
    const [textField, setTextField] = useState("");
    const [files, setFiles] = useState([]);

    const updateFiles = (incomingFiles) => {
        setFiles(incomingFiles);
        setOutput(files);
    };

    useEffect(() => {
        if (files.length === 0 && textField === "") {
            setDisplay("both");
            setOutput(null);
        } else if (files.length !== 0) {
            setDisplay("files");
            setOutput(files);
        } else if (textField !== "") {
            setDisplay("terms");
            setOutput(textField);
        }
    }, [files, textField, setOutput]);

    const name = ontology ? "ontology-" : "unstructured-terms-";

    return (
        <div
            className="ft-upload-block"
            style={{ gridColumn: ontology ? 3 : 1 }}
        >
            <h3 className="center-text">
                {ontology ? "Target Ontology" : "Source Terms"}
            </h3>
            <div
                className="ft-upload"
                style={{ justifyContent: display !== "both" ? "center" : "" }}
            >
                {(display === "both" || display === "files") && (
                    <Dropzone
                        onChange={updateFiles}
                        value={files}
                        accept={ontology ? ".owl" : ".txt"}
                        behavior="replace"
                        label={
                            ontology
                                ? "Drag ontology file here or click to browse computer."
                                : "Drop file of terms here (one term per line) or click to browse computer."
                        }
                        maxFiles={1}
                        minHeight={0}
                    >
                        {files.map((file) => (
                            <FileItem {...file} key={1} preview />
                        ))}
                    </Dropzone>
                )}

                {display === "both" && <h6 className="or"> - OR - </h6>}

                {(display === "both" || display === "terms") && (
                    <div className="arg-field textarea">
                        <div className="label">
                            <label htmlFor={name + "text-field"}>
                                {ontology ? "Ontology URL:" : "Enter Terms:"}
                            </label>
                        </div>

                        {ontology ? (
                            <input
                                style={{ width: "100%" }}
                                type="url"
                                name={name + "text-field"}
                                placeholder="(ontology acronyms when mapping with BioPortal/Zooma)"
                                value={textField}
                                onChange={(e) => setTextField(e.target.value)}
                            ></input>
                        ) : (
                            <textarea
                                name={name + "text-field"}
                                placeholder="(one term per line)"
                                value={textField}
                                onChange={(e) => setTextField(e.target.value)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileTextUpload;
