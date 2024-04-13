import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartComponent = ({ data }) => {

    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const [filterMin, setFilterMin] = useState(0);
    const [filterMax, setFilterMax] = useState(2000);
    const [selectedFirstField, setSelectedFirstField] = useState('Active_Power');
    const [selectedSecondField, setSelectedSecondField] = useState('Global_Horizontal_Radiation');

    useEffect(() => {

        if (data.length === 0) return;

        const scatterData = data.map(entry => ({
            x: entry[selectedFirstField],
            y: entry[selectedSecondField],
        }));

        setChartData({
            datasets: [
                {
                    data: scatterData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        });
    }, [selectedSecondField, selectedSecondField, data]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'min') {
            setFilterMin(parseInt(value));
        } else if (name === 'max') {
            setFilterMax(parseInt(value));
        }
    };

    const handleFieldOneChange = (event) => {
        setSelectedFirstField(event.target.value);
    };


    const handleFieldTwoChange = (event) => {
        setSelectedSecondField(event.target.value);
    };


    const filteredData = chartData.datasets.length > 0 ? chartData.datasets[0].data.filter(point =>
        point.x >= filterMin && point.x <= filterMax
    ) : [];

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Scatter Plot: Features Correlation</h2>
            <div className="flex items-center mb-4">
                <label htmlFor="start-date" className="mr-2">Min Irradiance</label>
                <input
                    type="number"
                    name="min"
                    value={filterMin}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md py-2 px-4"
                />

                <label htmlFor="start-date" className="ml-4 mr-2">Max Irradiance</label>
                <input
                    type="number"
                    name="max"
                    value={filterMax}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md py-2 px-4"
                />
            </div>
            <div className="flex items-center mb-4">
                <div className="mb-4">
                    <label htmlFor="field-select" className="mr-2">X-axis</label>
                    <select
                        id="field-select"
                        value={selectedFirstField}
                        onChange={handleFieldOneChange}
                        className="border border-gray-300 rounded-md py-2 px-4"
                    >
                        <option value="Active_Power">Active Power</option>
                        <option value="Weather_Temperature_Celsius">Weather Temperature (Celsius)</option>
                        <option value="Global_Horizontal_Radiation">Global Horizontal Radiation</option>
                        <option value="Weather_Relative_Humidity">Global Relative Humidity</option>
                        <option value="Weather_Daily_Rainfall">Weather Daily Rainfall</option>
                        <option value="Radiation_Global_Tilted">Radiation Global Tilted</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="field-select" className="mr-2 ml-4">Y-axis</label>
                    <select
                        id="field-select"
                        value={selectedSecondField}
                        onChange={handleFieldTwoChange}
                        className="border border-gray-300 rounded-md py-2 px-4"
                    >
                        <option value="Active_Power">Active Power</option>
                        <option value="Weather_Temperature_Celsius">Weather Temperature (Celsius)</option>
                        <option value="Global_Horizontal_Radiation">Global Horizontal Radiation</option>
                        <option value="Weather_Relative_Humidity">Global Relative Humidity</option>
                        <option value="Weather_Daily_Rainfall">Weather Daily Rainfall</option>
                        <option value="Radiation_Global_Tilted">Radiation Global Tilted</option>
                    </select>
                </div>
            </div>

            <div className="h-96">
                <Scatter
                    data={{
                        datasets: [{
                            ...chartData.datasets[0],
                            data: filteredData
                        }]
                    }}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: selectedFirstField,
                                    color: '#333',
                                    font: {
                                        weight: 'bold',
                                    }
                                },
                            },
                            y: {
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: selectedSecondField,
                                    color: '#333',
                                    font: {
                                        weight: 'bold',
                                    }
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                mode: 'nearest',
                                intersect: false
                            },
                        }
                    }}
                />
            </div>

        </div>
    );

};

export default ChartComponent;
