import { useState, useEffect } from "react";
import axios from 'axios';
import DataEntriesByArray from '../charts/DataEntriesByArray'
import DataEntiesByTime from '../charts/DataEntiesByTime'
import DataDistribution from '../charts/DataDistribution'
import FeaturesCorrelation from '../charts/FeaturesCorrelation'

export default function VisualizeStatistics () {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataToSend = { username: localStorage.getItem('username') };
        const response = await axios.post('http://localhost:5000/files', dataToSend);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <DataEntriesByArray data={chartData}/>
      <DataEntiesByTime data={chartData}/>
      <DataDistribution data={chartData}/>
      <FeaturesCorrelation data={chartData} />
    </div>
  );
}
