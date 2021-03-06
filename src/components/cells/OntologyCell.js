import { Network } from "vis-network";
// import { DataSet } from "vis-data";
import { useRef, useEffect } from "react";
import { default as _ } from "lodash";

const staticOptions = {
    nodes: {
        borderWidth: 0.5,
        borderWidthSelected: 1,
        color: {
            background: "#f8f9fa",
            border: "#000",
            highlight: {
                background: "#e2e2e2",
                border: "#000",
            },
        },
        font: {
            size: 10,
        },
        shape: "box",
        widthConstraint: 40,
    },
    edges: {
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 1,
                type: "arrow",
            },
        },
        font: {
            size: 10,
            vadjust: -15,
        },
        chosen: false,
        color: "#555",
    },
    autoResize: false,
    layout: {
        randomSeed: 0,
        hierarchical: {
            enabled: true,
            direction: "LR",
            sortMethod: "directed",
            shakeTowards: "leaves",
            levelSeparation: 120,
            nodeSpacing: 80,
        },
    },
    physics: { enabled: false },
    interaction: {
        dragNodes: false,
        zoomView: false,
        dragView: false,
        selectable: false,
    },
    width: "100%",
};

const dynamicOptions = {
    autoResize: false,
    nodes: {
        borderWidth: 0.5,
        borderWidthSelected: 1.5,
        color: {
            background: "#f8f9fa",
            border: "#000",
            highlight: {
                background: "#e2e2e2",
                border: "#000",
            },
            hover: {
                background: "#e2e2e2",
                border: "#000",
            },
        },
        widthConstraint: 75,
        shape: "box",
    },
    edges: {
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 1,
                type: "arrow",
            },
        },
        font: {
            size: 10,
            vadjust: -15,
        },
        chosen: false,
        color: "#555",
        widthConstraint: 50,
    },
    layout: {
        hierarchical: {
            enabled: true,
            direction: "LR",
            sortMethod: "directed",
            shakeTowards: "leaves",
        },
    },
    physics: { enabled: false },
    interaction: {
        dragNodes: false,
        zoomView: true,
        dragView: true,
        selectable: true,
        zoomSpeed: 0.3,
        hover: true,
    },
    width: "100%",
    height: "500px",
};

const clusterOptions = {
    clusterNodeProperties: {
        borderWidth: 1,
        font: {
            // use html parser
            multi: "html",
        },
        widthConstraint: 100,
        label: "<i>Click to Expand</i>",
        shape: "circle",
    },
};

export default function OntologyCell(props) {
    const cellRef = useRef();
    let network = useRef();
    useEffect(() => {
        const data = {
            nodes: props.graph.nodes,
            edges: props.graph.edges,
        };

        // find all nodes that connect to the main term
        let children = _.map(
            _.filter(props.graph.edges, ["to", props.id]),
            "from"
        );

        if (network.current) {
            // remove any existing network
            network.current.destroy();
        }
        if (props.edited) {
            // create in reference to big cell
            network.current = new Network(
                props.reference.current,
                data,
                dynamicOptions
            );
        } else {
            // create in the inline cell
            network.current = new Network(cellRef.current, data, staticOptions);
        }
        // cluster if more than 10 children
        if (children.length > 10) {
            network.current.cluster({
                joinCondition: (nodeOptions) =>
                    children.includes(nodeOptions.id),
                ...clusterOptions,
            });
            // resize canvas for the cluster
            network.current.fit();
        }
        // select the current term node
        network.current.selectNodes([props.id]);
        // click handler for actually switching the node value

        network.current.addEventListener("selectNode", (e) => {
            if (
                e.nodes.length === 1 &&
                !network.current.isCluster(e.nodes[0])
            ) {
                // add new term and select it
                const nodeId = e.nodes[0];
                const node = _.find(props.graph.nodes, { id: nodeId });
                // const mti = new URL(nodeId).pathname;
                const id = nodeId.slice(_.lastIndexOf(nodeId, "/") + 1);
                const newTerm = {
                    id: id,
                    mapped_ontology_iri: "http://www.ebi.ac.uk/efo/efo.owl#",
                    mapped_term_iri: nodeId,
                    mapped_term_label: node.label,
                    mapping_score: -1,
                    mapping_type: "exact",
                    selected: true,
                    status: "unapproved",
                };
                props.addNewTerm(newTerm);
                props.resetEditedCell(e);
            } else if (network.current.isCluster(e.nodes[0])) {
                // expand cluster
                network.current.openCluster(e.nodes[0]);
            }
        });
    }, [props]);

    const onClick = !props.edited ? props.setEdit : props.resetEditedCell;
    return (
        <td
            className={props.selected ? "interact-td" : ""}
            onClick={props.selected ? onClick : null}
        >
            {props.edited && <div>Click To Minimize Ontology</div>}
            <div ref={cellRef}></div>
        </td>
    );
}
