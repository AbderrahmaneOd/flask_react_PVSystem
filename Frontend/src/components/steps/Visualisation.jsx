import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DynamiqueTime from "../charts/DynamiqueTime"
import DynamiqueIrradiance from "../charts/DynamiqueIrradiance"
import TimeTech from "../charts/TimeTech"
import MaintenanceFreq from "../charts/MaintenanceFreq"
import TemperaturePowerDynamic from "../charts/TemperaturePowerDynamic"
import ManifPowerTime from "../charts/ManifPowerTime"
import TemperatureByArray from "../charts/TemperatureByArray"
import PowerByTimeLineChart from "../charts/PowerByTimeLineChart"
import MetricsByTechnologyBarChart from "../charts/MetricsByTechnologyBarChart"
import MetricsByTimeBarChart from "../charts/MetricsByTimeBarChart"
import MetricsByTechBarChart from "../charts/MetricsByTechBarChart"
import MetricsByPanelBarChart from "../charts/MetricsByPanelBarChart"

export default function Visualisation() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataToSend = { username: localStorage.getItem('username') };
        const response = await axios.post('http://localhost:5000/files', dataToSend);
        setChartData(response.data);
        //console.log(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <PowerByTimeLineChart data={chartData}/>
      {/*<MetricsByTechnologyBarChart /> */}
      <MetricsByTimeBarChart />
      <MetricsByTechBarChart />
      <MetricsByPanelBarChart />
      {/*<DynamiqueTime data={chartData} />
      <DynamiqueIrradiance data={chartData} />
      <TimeTech data={chartData} />
      <MaintenanceFreq  data={chartData} />
      <ManifPowerTime data={chartData}/>
      <TemperaturePowerDynamic data={chartData}/>
      <TemperatureByArray data={chartData} /> */}
    </div>
  );
}
