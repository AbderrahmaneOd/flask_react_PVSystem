import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ChartComponent = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get('http://localhost:5000/NaNvalue');
                const data = response.data;

                const filteredColumns = Object.keys(data).filter(key => data[key] !== 0);

                setChartData({
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: '%NaN Values',
                            data: Object.values(data),
                            fill: false,
                            backgroundColor: 'rgba(234, 174, 199, 0.8)',
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">NaN values</h2>
            <div>
                <Bar data={chartData} />
            </div>
        </div>
    );


};

export default ChartComponent;
