import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {
    const [chartData, setChartData] = useState(null);
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [selectedManuf, setSelectedManuf] = useState('');
    const [selectedYearsInstallation, setSelectedYearsInstallation] = useState('');

    useEffect(() => {
        if (data.length === 0) return;

        let filteredData = data;
        if (selectedTechnology) {
            filteredData = data.filter(entry => entry.technology === selectedTechnology);
        }

        if (selectedManuf) {
            filteredData = data.filter(entry => entry.manuf === selectedManuf);
        }

        // Ensure selectedYearsInstallation is numeric
        const numericYearsInstallation = parseInt(selectedYearsInstallation);
        if (!isNaN(numericYearsInstallation)) {
            filteredData = filteredData.filter(entry => entry.year_of_installation === numericYearsInstallation);
        }

        // Count the number of entries for each version in the filtered data
        const versionCounts = {};
        filteredData.forEach(entry => {
            const version = entry.version;
            if (!versionCounts[version]) {
                versionCounts[version] = 0;
            }
            versionCounts[version]++;
        });

        // Extract version labels and counts
        const labels = Object.keys(versionCounts);
        const counts = Object.values(versionCounts);

        // Set the chart data
        setChartData({
            labels: labels,
            datasets: [{
                label: 'Data Entries',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
            }]
        });
    }, [selectedTechnology, selectedManuf, selectedYearsInstallation, data]);

    const handleTechnologyChange = event => {
        setSelectedTechnology(event.target.value);
    };

    const handleManufChange = event => {
        setSelectedManuf(event.target.value);
    };

    const handleYearsChange = event => {
        setSelectedYearsInstallation(event.target.value);
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Number of Data Entries by Version</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <select
                    id="version"
                    value={selectedTechnology}
                    onChange={handleTechnologyChange}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="">All technology</option>
                    {data && data.length > 0 && [...new Set(data.map(entry => entry.technology))].map(technology => (
                        <option key={technology} value={technology}>{technology}</option>
                    ))}
                </select>

                <select
                    id="version"
                    value={selectedManuf}
                    onChange={handleManufChange}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="">All manufacturer</option>
                    {data && data.length > 0 && [...new Set(data.map(entry => entry.manuf))].map(manuf => (
                        <option key={manuf} value={manuf}>{manuf}</option>
                    ))}
                </select>

                <select
                    id="version"
                    value={selectedYearsInstallation}
                    onChange={handleYearsChange}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="">Year of installation</option>
                    {data && data.length > 0 && [...new Set(data.map(entry => entry.year_of_installation))].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

            </div>

            <div style={{ height: '300px', width: '600px' }}>
                {chartData && (
                    <Bar
                        data={chartData}
                        options={{
                            indexAxis: 'y', // Horizontal bar chart
                            responsive: true,
                            scales: {
                                x: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ChartComponent;
