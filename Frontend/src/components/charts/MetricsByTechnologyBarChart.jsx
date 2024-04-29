import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const ChartComponent = ({ data }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [grouping, setGrouping] = useState('D');

    useEffect(() => {
        const calculateMAE = async () => {
            try {

                const response = await axios.post('http://localhost:5000/api/mae', {
                    grouping
                });

                console.log(response.data);

                setChartData(response.data);
            } catch (error) {
                console.error('Error calculating MAE:', error);
            }
        };

        calculateMAE();
    }, [grouping, data]);

    const handleGroupingChange = (event) => {
        setGrouping(event.target.value);
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Mean Absolute Error (MAE) by Panel Technology</h2>
            <div>
                <select
                    id="grouping"
                    value={grouping}
                    onChange={handleGroupingChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mr-2"
                >
                    <option value="D">Day</option>
                    <option value="M">Month</option>
                    <option value="Y">Year</option>
                </select>
            </div>
            <div>
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default ChartComponent;
