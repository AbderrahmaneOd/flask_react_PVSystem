import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import config from "../../config.json";

function DiskUsage() {
  const [diskUsage, setDiskUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // State pour le token

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchDiskUsage();
    }
  }, [token]);

  const fetchDiskUsage = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/disk_usage`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDiskUsage(data.disk_usage_percent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching disk usage:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: 350, height: 420 }}>
      <br/>
      <CircularProgress
        variant="determinate"
        value={100}
        size={350}
        thickness={6} // Augmenter l'épaisseur du cercle gris pour un meilleur contraste
        style={{ position: 'absolute', color: '#f0f0f0' }}
      />
      <CircularProgress
        variant="determinate"
        value={diskUsage}
        size={350}
        thickness={6} // Augmenter l'épaisseur du cercle bleu pour un meilleur contraste
        style={{
          position: 'absolute',
          color: '#0000ff',
          clipPath: `url(#clip-path-${diskUsage})`,
        }}
      />
      <Typography
        variant="h5"
        component="div"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#000000',
        }}
      >
        {loading ? 'Loading...' : `${diskUsage.toFixed(1)}%`}
      </Typography>
      <svg style={{ position: 'absolute', height: 0 }}>
        <defs>
          <clipPath id={`clip-path-${diskUsage}`}>
            <circle cx="175" cy="175" r="168" fill="transparent" stroke="white" strokeWidth="1" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default DiskUsage;
