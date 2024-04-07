import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';

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

  return (
    <div>
      <h2>Scatter Plot: Active Power vs Global Horizontal Radiation</h2>
      <div style={{ height: '400px', width: '600px' }}>
        <Scatter
          data={chartData}
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
          }}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
