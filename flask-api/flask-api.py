from flask import Flask, request, Response, send_file, send_from_directory
from subprocess import Popen, PIPE
import json
import uuid

app = Flask(__name__)

OUTPUT_FOLDER = "output/"


@app.route("/api")
def server_running():
    return "SERVER RUNNING"


@app.route("/api/upload_file", methods=["POST"])
def upload_file():
    if "unstructured_terms_text" in request.form:
        # text is list of terms, write to file
        with open("unstructured_terms.txt") as f:
            f.write(request.form["unstructured_terms_text"])
    else:
        # text in file, save it
        f1 = request.files["unstructured_terms_file"]
        f1.save("unstructured_terms.txt")

    # source always held in unstructured_terms.txt
    source = "unstructured_terms.txt"

    if "ontology_text" in request.form:
        # target is link, just keep as link
        target = request.form["ontology_text"]
    else:
        # target is file, save it and point to path
        f1 = request.files["ontology_file"]
        f1.save("ontology.owl")
        target = "ontology.owl"

    output = OUTPUT_FOLDER + "t2t-out.csv"
    command = [
        "python",
        "ontology-mapper/text2term",
        "-s",
        source,
        "-t",
        target,
        "-o",
        output,
        "-top",
        request.form["top_mappings"],
        "-min",
        request.form["min_score"],
        "-iris",
        request.form["base_iris"],
    ]

    if request.form["incl_deprecated"] == "false":
        command += ["-d"]

    if request.form["incl_individuals"] == "true":
        command += ["-i"]

    # subprocess.run(command)

    with open("output/db.txt", "w") as f:
        f.write(
            "Starting Mapping Process\n"
        )  # append line to the appropriate status file

    with Popen(command, stdout=PIPE, bufsize=1, universal_newlines=True) as p:
        for line in p.stdout:
            print(line)  # for local debugging
            with open("output/db.txt", "a") as f:
                f.write(line)  # append line to the appropriate status file

    with open("output/db.txt", "w") as f:
        f.write("DONE")  # overwrite file

    resp = Response("Upload Successful")
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@app.route("/api/current_status", methods=["GET"])
def current_status():
    with open("output/db.txt", "r") as f:
        text = f.read()
    resp = Response(text)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@app.route("/api/download_csv")
def download_csv():
    resp = send_from_directory(OUTPUT_FOLDER, "t2t-out.csv")
    resp.headers["Content-Type"] = "text/csv"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


@app.route("/api/download_graph_json")
def download_graph_json():
    resp = send_from_directory(OUTPUT_FOLDER, "t2t-out.csv-term-graphs.json")
    resp.headers["Content-Type"] = "application/json"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


if __name__ == "__main__":
    app.run(port=5000)
