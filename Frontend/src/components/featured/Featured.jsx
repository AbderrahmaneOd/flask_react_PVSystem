import React, { useState, useEffect } from "react";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import config from "../../config.json";

const Featured = () => {
  const [rolePercentages, setRolePercentages] = useState(null);
  const [token, setToken] = useState(null); // State pour le token

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
      const response = await axios.get(`${config.apiUrl}/users/percentage-by-role`, {
        headers: {
          Authorization: `Bearer ${token}` // Utilisation du token dynamique
        }
      });
      setRolePercentages(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Répartition des pourcentages par type d'utilisateur</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <div className="roleCircularProgressContainer">
            {rolePercentages &&
              Object.entries(rolePercentages).map(([role, percentage]) => (
                <div key={role} className="roleCircularProgress">
                  <p className="roleTitle">{role}</p>
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth={5}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
