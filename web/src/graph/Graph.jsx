import './Graph.css';
import React from 'react';
import PlutoGraph from '../components/plutoGraph/PlutoGraph.jsx';

const Graph = () => {
    return (
        <div className="graph">
            <h1>Wykres Pluty</h1>
            <PlutoGraph />
        </div>
    );
};

export default Graph;