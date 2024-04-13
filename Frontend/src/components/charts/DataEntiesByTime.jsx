import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [groupBy, setGroupBy] = useState('year');

    useEffect(() => {
        if (data.length === 0) return;

        // Group data by the selected option
        const groupedData = {};
        data.forEach(entry => {
            let date;
            if (groupBy === 'day') {
                date = entry.Timestamp.split(' ')[0]; // Group by day
            } else if (groupBy === 'month') {
                date = entry.Timestamp.split('-').slice(0, 2).join('-'); // Group by month
            } else if (groupBy === 'year') {
                date = entry.Timestamp.split('-')[0]; // Group by year
            }

            if (!groupedData[date]) {
                groupedData[date] = {};
            }

            const version = entry.version;
            if (!groupedData[date][version]) {
                groupedData[date][version] = 0;
            }
            groupedData[date][version]++;
        });

        // Extract labels and counts from grouped data
        const labels = Object.keys(groupedData);
        const datasets = Object.keys(data.reduce((acc, cur) => ({...acc, [cur.version]: 1}), {})).map(version => {
            const counts = labels.map(date => groupedData[date][version] || 0);
            return {
                label: `Version ${version}`,
                data: counts,
                fill: false,
                backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`,
            };
        });

        setChartData({
            labels: labels,
            datasets: datasets,
        });

    }, [groupBy, data]);

    const handleGroupByChange = event => {
        setGroupBy(event.target.value);
    };


    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Number of Data Entries by Version</h2>
            <div className="flex items-center mb-4">
                <select
                    id="group-by"
                    value={groupBy}
                    onChange={handleGroupByChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mr-2"
                >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>                
            </div>
            <div>
                <Bar
                    data={chartData}
                />
            </div>
        </div>
    );
};

export default ChartComponent;
