import DynamiqueTime from "../charts/DynamiqueTime"
import DynamiqueIrradiance from "../charts/DynamiqueIrradiance"
import TimeTech from "../charts/TimeTech"
import MaintenanceFreq from "../charts/MaintenanceFreq"
import TemperaturePowerDynamic from "../charts/TemperaturePowerDynamic"
import ManifPowerTime from "../charts/ManifPowerTime"
import axios from 'axios';
import React, { useState, useEffect } from 'react';

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
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
      
      <DynamiqueTime data={chartData} />
      <DynamiqueIrradiance data={chartData} />
      <TimeTech data={chartData} />
      <MaintenanceFreq  data={chartData} />
      <ManifPowerTime data={chartData}/>
      <TemperaturePowerDynamic data={chartData}/>

    </div>
  );
}
