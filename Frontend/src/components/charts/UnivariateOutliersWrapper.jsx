import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './UnivariateOutliers';

const ChartWrapper = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/outliers');
                const data = response.data;
                //console.log(Object.values(data)[0]);
                setChartData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Outliers detection</h2>
            {chartData && Object.entries(chartData).map(([label, data]) => {
                //console.log("Label:", label);
                //console.log("Data:", data);
                return <ChartComponent key={label} label={label} data={data} />;
            })}
        </div>
    );
};

export default ChartWrapper;
