import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { useRef, useEffect } from "react";

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
    useEffect(() => {
        const data = {
            nodes: nodes,
            edges: edges,
        };
        new Network(cellRef.current, data, {});
    }, []);

    return <td ref={cellRef}>Test</td>;
}
