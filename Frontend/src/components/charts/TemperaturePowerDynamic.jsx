import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import Slider from '@mui/material/Slider';

const ChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [temperatureRange, setTemperatureRange] = useState([0, 60]);
  const [selectedVersion, setSelectedVersion] = useState('');

  useEffect(() => {


    const dataFilter = data.filter(entry => {
      const temperature = entry.Weather_Temperature_Celsius;
      const versionMatch = selectedVersion ? entry.version == selectedVersion : true;
      return versionMatch && temperature >= temperatureRange[0] && temperature <= temperatureRange[1];
    });

    const scatterData = dataFilter.map(entry => ({
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

  }, [temperatureRange, selectedVersion, data]);

  const handleTemperatureChange = (event, newValue) => {
    setTemperatureRange(newValue);
  };

  const handleVersionChange = event => {
    setSelectedVersion(event.target.value);
    // console.log("Selected Version:", selectedVersion);
  };

  return (
    <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Scatter Plot: Active Power vs Temperature</h2>
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
      </div>
      <div className="h-96">
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
