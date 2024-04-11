import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { LinearScale, CategoryScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import axios from 'axios';

Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

const ChartComponent = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/outliers');
                const data = response.data;

                //console.log(data);
                //console.log(Object.values(data)[0]);

                const chartData = {
                    labels: ['Temperature'],
                    datasets: [
                        {
                            label: 'Data',
                            data: [
                                Object.values(data)[0],
                            ],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            itemRadius: 1,
                        },
                    ],
                };

                setChartData(chartData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (chartData) {
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'boxplot',
                data: chartData,
            });

            return () => {
                myChart.destroy(); // Cleanup
            };
        }


        fetchData();
    }, [chartData]);


    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10, // Adjust the font size of X-axis ticks
                    }
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 60, // Adjust the font size of Y-axis ticks
                    }
                },
            }
        }
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Outliers detection</h2>

            <div style={{ height: '300px', width: '600px' }}>
                <canvas id="myChart"></canvas>
            </div>
        </div>
    );
};

export default ChartComponent;
