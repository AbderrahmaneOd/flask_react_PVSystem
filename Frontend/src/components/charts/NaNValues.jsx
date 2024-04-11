import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ChartComponent = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '% NaN Values ',
                data: [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
            },
        ],
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/NaNvalue');

                const data = response.data;

                console.log(data);
                console.log("Test");

                setChartData({
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: '%NaN Values',
                            data: Object.values(data),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
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
        <div className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">NaN values</h2>
            <div style={{ height: '300px', width: '600px' }}>
                <Bar
                    data={chartData}
                />
            </div>
        </div>
    );


};

export default ChartComponent;
