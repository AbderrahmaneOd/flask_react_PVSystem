import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Active Power vs Global Horizontal Radiation',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  const [filterMin, setFilterMin] = useState(0);
  const [filterMax, setFilterMax] = useState(5); // Set initial max value, adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');

        const data = response.data;

        const scatterData = data.map(entry => ({
          x: entry.Global_Horizontal_Radiation,
          y: entry.Active_Power,
        }));

        setChartData({
          datasets: [
            {
              label: 'Active Power vs Global Horizontal Radiation',
              data: scatterData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'min') {
      setFilterMin(parseInt(value));
    } else if (name === 'max') {
      setFilterMax(parseInt(value));
    }
  };

  const filteredData = chartData.datasets[0].data.filter(point =>
    point.x >= filterMin && point.x <= filterMax
  );

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Scatter Plot: Active Power vs Global Horizontal Radiation</h2>
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
      <div style={{ height: '400px', width: '600px' }}>
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
                  text: 'Global Horizontal Radiation',
                },
              },
              y: {
                type: 'linear',
                position: 'left',
                title: {
                  display: true,
                  text: 'Active Power',
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
