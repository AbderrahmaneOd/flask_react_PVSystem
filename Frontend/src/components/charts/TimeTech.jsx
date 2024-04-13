import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);

const ChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [grouping, setGrouping] = useState('day');

  useEffect(() => {
        
        // Group data by panel technology and calculate average power production
        const averagePowerByTechnology = {};

        data.forEach((item) => {
          const technology = item.technology;
          const power = item.Active_Power;
          const timestamp = item.Timestamp;

          const date = new Date(timestamp);
          let key = '';

          if (grouping === 'day') {
            key = `${date.toISOString().split('T')[0]}`;
          } else if (grouping === 'month') {
            key = `${date.toISOString().split('-').slice(0, 2).join('-')}`;
          } else if (grouping === 'year') {
            key = `${date.toISOString().split('-')[0]}`;
          }

          if (!averagePowerByTechnology[key]) {
            averagePowerByTechnology[key] = {};
          }

          if (!averagePowerByTechnology[key][technology]) {
            averagePowerByTechnology[key][technology] = { totalPower: 0, count: 0 };
          }
          averagePowerByTechnology[key][technology].totalPower += power;
          averagePowerByTechnology[key][technology].count += 1;
        });

        const techLabels = Object.keys(averagePowerByTechnology);
        const datasets = Object.keys(data.reduce((acc, cur) => {
          acc[cur.technology] = true;
          return acc;
        }, {})).map((technology, index) => {
          const techData = techLabels.map(date => {
            return averagePowerByTechnology[date][technology] ? averagePowerByTechnology[date][technology].totalPower / averagePowerByTechnology[date][technology].count : 0;
          });

          return {
            label: technology,
            data: techData,
            backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`,
          };
        });

        setChartData({
          labels: techLabels,
          datasets: datasets,
        });

  }, [grouping, data]);

  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };

  return (
    <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Power Production by Panel Technology</h2>
      <div>
        <select
          id="grouping"
          value={grouping}
          onChange={handleGroupingChange}
          className="border border-gray-300 rounded-md py-2 px-4 mr-2"
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default ChartComponent;
