import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { useRef, useEffect } from "react";

const staticOptions = {
    layout: { hierarchical: { enabled: true, direction: "LR" } },
    physics: { enabled: false },
    interaction: { dragNodes: false, zoomView: false, dragView: false },
    width: "100%",
};

const dynamicOptions = {
    layout: { hierarchical: { enabled: true, direction: "LR" } },
    physics: { enabled: false },
    interaction: { dragNodes: false, zoomView: true, dragView: true },
    width: "100%",
    height: "500px",
};

const nodes = new DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
]);

// create an array with edges
const edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
]);

export default function OntologyCell(props) {
    const cellRef = useRef();
    let network = useRef();
    useEffect(() => {
        const data = {
            nodes: nodes,
            edges: edges,
        };
        if (network.current) {
            network.current.destroy();
        }
        if (props.edited) {
            network.current = new Network(
                props.reference.current,
                data,
                dynamicOptions
            );
        } else {
            network.current = new Network(cellRef.current, data, staticOptions);
        }
    }, [props.edited, props.reference]);

    return (
        <td onClick={!props.edited ? props.setEdit : props.resetEditedCell}>
            {props.edited && <div>Click To Minimize Ontology</div>}
            <div ref={cellRef}></div>
        </td>
    );
}
