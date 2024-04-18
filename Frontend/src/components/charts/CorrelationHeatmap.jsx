import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const CorrelationHeatmap = () => {
    const [correlationData, setCorrelationData] = useState({ z: [], x: [], y: [] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/correlation');
            setCorrelationData(response.data);

            //const responseData = JSON.parse(response.data);
            //console.log(response.data);
        } catch (error) {
            console.error('Error fetching correlation data:', error);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <Plot
                data={[
                    {
                        /*z: [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
                        x: ['Monday', 'Tuesday', 'Wednesday',],
                        y: ['Morning', 'Afternoon', 'Evening'],*/
                        z: correlationData.z,
                        x: correlationData.x,
                        y: correlationData.y, 
                        type: 'heatmap',
                        colorscale: 'Viridis'
                    }
                ]}
                layout={{
                    width: 900,
                    height: 600,
                    title: 'Features Correlation Heatmap'
                }}
            />
        </div>
    );
};

export default CorrelationHeatmap;
