import './Graph.css';
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