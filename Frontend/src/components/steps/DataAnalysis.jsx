import { useState, useEffect } from "react";
import axios from 'axios';
import DataEntriesByArray from '../charts/DataEntriesByArray'
import DataEntiesByTime from '../charts/DataEntiesByTime'
import DataDistribution from '../charts/DataDistribution'
import CorrelationScatterPlot from '../charts/CorrelationScatterPlot'
import StatisticsTable from '../scripts/StatisticsTable'
import FeatureSelection from '../scripts/FeatureSelection'
import NaNValues from '../charts/NaNValues'
import UnivariateOutliersWrapper from '../charts/UnivariateOutliersWrapper'
import CorrelationHeatmap from '../charts/CorrelationHeatmap'
import CorrelationBarChart from './../charts/CorrelationBarChart'
import FeatureTypeTable from './../scripts/FeatureTypeTable'

export default function VisualizeStatistics() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataToSend = { username: localStorage.getItem('username') };
        const response = await axios.post('http://localhost:5000/files', dataToSend);
        setChartData(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      
      <StatisticsTable />
      <FeatureTypeTable />
      <NaNValues />
      <UnivariateOutliersWrapper />
      <CorrelationHeatmap />
      <CorrelationBarChart />
      <CorrelationScatterPlot data={chartData}/>
      <DataEntriesByArray data={chartData} />
      <DataEntiesByTime data={chartData} />
      <DataDistribution data={chartData} />
      <FeatureSelection data={chartData} />
    </div>
  );
}
