import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [groupBy, setGroupBy] = useState('year');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {

    // Filter data within the selected date range
    const filteredData = data.filter(entry => {
      const entryDate = new Date(entry.Timestamp);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return entryDate >= start && entryDate <= end;
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
        groupedData[date] = { total: 0, count: 0 };
      }
      groupedData[date].total += activePower;
      groupedData[date].count++;
    });

    const labels = Object.keys(groupedData);
    const averagePowers = labels.map(date => groupedData[date].total / groupedData[date].count);

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
      ],
    });

  }, [groupBy, startDate, endDate, data]);

  const handleGroupByChange = event => {
    setGroupBy(event.target.value);
  };

  const handleStartDateChange = event => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = event => {
    setEndDate(event.target.value);
  };

  return (
    <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Power Generation vs. Time</h2>
      <div className="flex items-center mb-4">
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
        <label htmlFor="start-date" className="mr-2">Start Date</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
          className="border border-gray-300 rounded-md py-2 px-4 mr-2"
        />
        <label htmlFor="end-date" className="mr-2">End Date</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
          className="border border-gray-300 rounded-md py-2 px-4"
        />
      </div>
      <div>
        <Line
          data={chartData}
        />
      </div>
    </div>
  );


};

export default ChartComponent;
