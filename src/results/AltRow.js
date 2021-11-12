function AltRow(props) {
    const row = props.row;
    return (
        <tr key={row["Mapped Term Identifier"]}>
            <td key="Source Term">{row["Source Term"]}</td>
            <td key="Mapped Term Label">{row["Mapped Term Label"]}</td>
            <td key="Mapped Term Identifier">
                {row["Mapped Term Identifier"]}
            </td>
            <td key="Score">{parseFloat(row["Score"]).toFixed(3)}</td>
            <td key="Ontology">Ontology To Come</td>
            <td key="Mapping Type">-</td>
            <td key="View Alternate Mappings" onClick={e => props.setMain(e)}>
                Select Mapping
            </td>
            <td key="Approve or Reject">-</td>
        </tr>
    );
}

export default AltRow;
