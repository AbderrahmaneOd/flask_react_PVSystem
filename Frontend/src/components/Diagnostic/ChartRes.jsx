import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import config from "../../config.json";

const ChartRes = () => {
  const [responseData, setResponseData] = useState(null);
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
      const response = await fetch(`${config.apiUrl}/response_statistics`, {
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
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (responseData) {
      renderChart();
    }
  }, [responseData]);

  const renderChart = () => {
    if (chartRef.current !== null) {
      chartRef.current.destroy(); 
    }

    const ctx = document.getElementById('responseChart');
    const labels = Object.keys(responseData).filter(key => key !== 'response_counts');
    const data = labels.map(label => responseData[label]);
    
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Response Counts',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1 
            }
          }
        }
      }
    });
  };

  return (
    <div className="card-body" style={{marginLeft: '30px' , width: '400px', height: '400px' }}>
      <canvas id="responseChart" width="400" height="400"></canvas>
    </div>
  );
};

export default ChartRes;
