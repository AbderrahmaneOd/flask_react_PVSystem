import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import Slider from '@mui/material/Slider';

const ChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [temperatureRange, setTemperatureRange] = useState([0, 100]);

  useEffect(() => {


    const data2 = data.filter(entry => {
      const temperature = entry.Weather_Temperature_Celsius;
      return temperature >= temperatureRange[0] && temperature <= temperatureRange[1];
    });

    const scatterData = data2.map(entry => ({
      x: entry.Weather_Temperature_Celsius,
      y: entry.Active_Power,
    }));

    setChartData({
      datasets: [
        {
          label: 'Active Power vs Temperature',
          data: scatterData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });

  }, [temperatureRange, data]);

  const handleTemperatureChange = (event, newValue) => {
    setTemperatureRange(newValue);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Scatter Plot: Active Power vs Temperature</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span className="mr-3">Min : {temperatureRange[0]}</span>
          <span>Max : {temperatureRange[1]}</span>
          <Slider
            value={temperatureRange}
            onChange={handleTemperatureChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </div>
      </div>
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
                  text: 'Temperature',
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
