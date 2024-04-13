import { useState, useEffect } from "react";
import axios from 'axios';
import DataEntriesByArray from '../charts/DataEntriesByArray'
import DataEntiesByTime from '../charts/DataEntiesByTime'

export default function VisualizeStatistics () {
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
    <div className="flex flex-col ">
      <DataEntriesByArray data={chartData}/>
      <DataEntiesByTime data={chartData}/>
    </div>
  );
}
