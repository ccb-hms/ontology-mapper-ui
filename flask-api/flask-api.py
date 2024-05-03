from flask import Flask, request, Response, send_file, send_from_directory
from threading import Thread
import sys
import json
import uuid
import os
import logging
import text2term
import pandas

app = Flask(__name__)

OUTPUT_FOLDER = "output/"
INPUT_FOLDER = "input/"

# Routing for the main part of the application
@app.route("/api")
def server_running():
    resp = Response("SERVER RUNNING")
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Routing for the actual mapping, used most of the time
@app.route("/api/run_mapper", methods=["POST"])
def run_mapper():
    processId = uuid.uuid4()

    # source always held in {processId}.txt
    source = INPUT_FOLDER + f"{processId}.txt"

    if "unstructured_terms_text" in request.form:
        # text is list of terms, write to file
        if not os.path.exists("input"):
            os.mkdir("input")
        with open(source, 'a+') as f:
            f.write(request.form["unstructured_terms_text"])
    else:
        # text in file, save it
        f1 = request.files["unstructured_terms_file"]
        f1.save(source)

    if "ontology_text" in request.form:
        # target is link, just keep as link
        target = request.form["ontology_text"]
    else:
        # target is file, save it and point to path ({processId.owl})
        target = INPUT_FOLDER + f"{processId}.owl"
        f1 = request.files["ontology_file"]
        f1.save(target)

    output = OUTPUT_FOLDER + f"{processId}.csv"
    logFile = OUTPUT_FOLDER + f"{processId}.txt"

    with open(logFile, "w") as f:
        f.write("Initializing mapper...\n")

    if len(request.form["base_iris"]) > 0:
        base_iris = tuple(request.form["base_iris"].split(','))
    else:
        base_iris = ()

    excl_deprecated = (request.form["excl_deprecated"] == "true")
    max_mappings = int(request.form["top_mappings"])
    min_score = float(request.form["min_score"])
    mapper = text2term.Mapper(request.form["mapper"])

    def run_mapper(logFile, source, target, output, base_iris, \
                    excl_deprecated, max_mappings, min_score, mapper):
        with app.test_request_context():
            with open(logFile, "a") as f:
                sys.stdout = f
                mappings = text2term.map_terms(source, target, base_iris=base_iris, \
                    excl_deprecated=excl_deprecated, \
                    max_mappings=max_mappings, \
                    min_score=min_score, \
                    mapper=mapper, output_file=output, \
                    save_graphs=True, save_mappings=False, use_cache=False)
                mappings.to_csv(output, index=False, mode='a')
                f.write("\nDONE")  # overwrite file

    new_thread = Thread(target=run_mapper, \
                        args=(logFile, source, target, output, base_iris, \
                            excl_deprecated, max_mappings, min_score, mapper,))

    new_thread.start()

    resp = Response(str(processId))
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Routing to check how the current process is running
@app.route("/api/current_status", methods=["GET"])
def current_status():
    processId = request.args["processId"]
    with open(OUTPUT_FOLDER + f"{processId}.txt", "r") as f:
        text = f.read()
    resp = Response(text)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Routing to upload old results and continue working with them
@app.route("/api/old_results", methods=["POST"])
def old_results():
    processId = uuid.uuid4()
    csv = OUTPUT_FOLDER + f"{processId}.csv"
    termGraphsJson = OUTPUT_FOLDER + f"{processId}.csv-term-graphs.json"

    f1 = request.files["csv"]
    f1.save(csv)

    f2 = request.files["term_graphs_json"]
    f2.save(termGraphsJson)

    resp = Response(str(processId))
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Routing to download the csv of the mapping data
@app.route("/api/download_csv", methods=["GET"])
def download_csv():
    processId = request.args["processId"]
    resp = send_from_directory(OUTPUT_FOLDER, f"{processId}.csv")
    resp.headers["Content-Type"] = "text/csv"
    resp.headers["Access-Control-Allow-Origin"] = "Content-Type"
    return resp

# Routing to download the JSON graph of the mapping data for later usage
@app.route("/api/download_graph_json", methods=["GET"])
def download_graph_json():
    processId = request.args["processId"]
    resp = send_from_directory(OUTPUT_FOLDER, f"{processId}.csv-term-graphs.json")
    resp.headers["Content-Type"] = "application/json"
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp

# Main function to run the app
if __name__ == "__main__":
    production_host = 'text2term.hms.harvard.edu'
    development_host = 'localhost'
    app.run(port=8601, host=development_host) # In production, variable changes
