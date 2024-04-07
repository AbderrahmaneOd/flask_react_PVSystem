import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const MaintenanceFrequencyChart = () => {
  const [maintenanceData, setMaintenanceData] = useState({
    labels: [],
    datasets: [],
  });
  const [grouping, setGrouping] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files'); // Assuming the endpoint for maintenance data
        const data = response.data;

        // Group maintenance data by time period
        const maintenanceFrequency = {};

        data.forEach((item) => {
          const timestamp = new Date(item.Timestamp);
          let key = '';

          if (grouping === 'day') {
            key = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
          } else if (grouping === 'month') {
            key = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}`;
          } else if (grouping === 'year') {
            key = `${timestamp.getFullYear()}`;
          }

          // Check if maintenance event occurred based on conditions
          const maintenanceEventOccurred = item.maintenance_startm !== 0 || item.maintenance_starth !== 0 || item.maintenance_endm !== 0 || item.maintenance_endh !== 0;

          if (maintenanceEventOccurred) {
            if (!maintenanceFrequency[key]) {
              maintenanceFrequency[key] = 0;
            }
            maintenanceFrequency[key]++;
          }
        });

        // Convert maintenance frequency object into arrays for chart data
        const labels = Object.keys(maintenanceFrequency);
        const dataValues = Object.values(maintenanceFrequency);

        setMaintenanceData({
          labels: labels,
          datasets: [
            {
              label: 'Maintenance Frequency',
              data: dataValues,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ],
        });
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
      }
    };

    fetchData();
  }, [grouping]);

  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Maintenance Frequency</h2>
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
      <div style={{ height: '250px', width: '500px' }}>
        <Bar data={maintenanceData} />
      </div>
    </div>
  );
};

export default MaintenanceFrequencyChart;
