import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import { Line } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const [temperatureRange, setTemperatureRange] = useState([0, 60]);
    const [groupBy, setGroupBy] = useState('year');
    const [selectedVersion, setSelectedVersion] = useState();

    useEffect(() => {

        // Filter data based on the selected PV array version
        //let filteredData = selectedVersion ? data.filter(entry => entry.version === selectedVersion) : data;

        // Filter data based on temperature range
        const filteredData = data.filter(entry => {
            const temperature = entry.Weather_Temperature_Celsius;
            //const version = entry.version;
            const versionMatch = selectedVersion ? entry.version == selectedVersion : true;
            return versionMatch && temperature >= temperatureRange[0] && temperature <= temperatureRange[1];
        });

        // Group filtered data by the selected option
        const groupedData = {};
        filteredData.forEach(entry => {
            let date;
            if (groupBy === 'day') {
                date = entry.Timestamp.split(' ')[0]; // Group by day
            } else if (groupBy === 'month') {
                date = entry.Timestamp.split('-').slice(0, 2).join('-'); // Group by month
            } else if (groupBy === 'year') {
                date = entry.Timestamp.split('-')[0]; // Group by year
            } else if (groupBy === 'hour') {
                date = entry.Timestamp.split(' ')[0] + ' ' + entry.Timestamp.split(' ')[1].split(':')[0]; // Group by hour
            }

            const activePower = entry.Active_Power;
            if (!groupedData[date]) {
                groupedData[date] = { total: 0, count: 0, temperatureTotal: 0, temperatureCount: 0 };
            }
            groupedData[date].total += activePower;
            groupedData[date].count++;

            // Accumulate temperature data
            groupedData[date].temperatureTotal += entry.Weather_Temperature_Celsius;
            groupedData[date].temperatureCount++;
        });

        const labels = Object.keys(groupedData);
        const averagePowers = labels.map(date => groupedData[date].total / groupedData[date].count);

        // Calculate average temperature values
        const averageTemperatures = labels.map(date => groupedData[date].temperatureTotal / groupedData[date].temperatureCount);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Average Active Power',
                    data: averagePowers,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                },
                {
                    label: 'Average Temperature (°C)',
                    data: averageTemperatures,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                }
            ],
        });
        //console.log("Filtered Data:", filteredData);

    }, [temperatureRange, groupBy, selectedVersion, data]);

    const handleTemperatureChange = (event, newValue) => {
        setTemperatureRange(newValue);
    };

    const handleGroupByChange = event => {
        setGroupBy(event.target.value);
    };

    const handleVersionChange = event => {
        setSelectedVersion(event.target.value);
       // console.log("Selected Version:", selectedVersion);
    };


    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Line: Average Power vs. Temperature</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <span className="mr-3">Min Temperature: {temperatureRange[0]}°C</span>
                    <span>Max Temperature: {temperatureRange[1]}°C</span>
                    <Slider
                        value={temperatureRange}
                        onChange={handleTemperatureChange}
                        min={0}
                        max={60}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                </div>
                <select
                    id="version"
                    value={selectedVersion}
                    onChange={handleVersionChange}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="">All Versions</option>
                    {data && data.length > 0 && [...new Set(data.map(entry => entry.version))].map(version => (
                        <option key={version} value={version}>{version}</option>
                    ))}
                </select>
                <select
                    id="group-by"
                    value={groupBy}
                    onChange={handleGroupByChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mr-2"
                >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default ChartComponent;

