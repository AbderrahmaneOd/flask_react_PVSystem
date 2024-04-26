import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import config from "../../config.json";

const PieChart = () => {
  const [requestData, setRequestData] = useState(null);
  const [token, setToken] = useState(null); // Ajout du state pour le token
  const chartRef = useRef(null);
 
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/request_stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Utilisation du token dynamique
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRequestData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (requestData) {
      renderChart();
    }
  }, [requestData]);

  const renderChart = () => {
    if (chartRef.current !== null) {
      chartRef.current.destroy(); 
    }

    const ctx = document.getElementById('requestChart');
    const labels = Object.keys(requestData).filter(key => key !== 'average_response_time' && key !== 'request_counts' && key !== 'server_status');
    const data = labels.map(label => requestData[label]);
    
    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)', // rouge
            'rgba(54, 162, 235, 0.6)', // bleu
            'rgba(255, 206, 86, 0.6)', // jaune
            'rgba(75, 192, 192, 0.6)' // vert
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      }
    });
  };

  return (
    <div className="card-body" style={{ marginLeft: '200px' ,width: '400px', height: '400px' }}>
      <canvas id="requestChart" width="400" height="400"></canvas>
    </div>
  );
};

export default PieChart;
