import './Graph.css';
import React from 'react';
import PlutoGraph from '../components/plutoGraph/PlutoGraph.jsx';
import Background from "../components/background/Background.jsx";

const Graph = () => {
    return (
        <div className="graph">
            <PlutoGraph/>
            <Background/>
        </div>
    );
};

export default Graph;