import React, { useState, useEffect } from "react";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FunctionsIcon from '@mui/icons-material/Functions';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import config from "../../config.json";

import "./widget.scss";

const Widget = ({ type }) => {
  const [stats, setStats] = useState(null);
  const [methode, setMethode] = useState("");
  const [title, setTitle] = useState("");



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.apiUrl}/request_stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response from API:", response.data); // Ajout du console.log

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    switch (type) {
      case "Nombre_Requete_POST":
        setMethode("POST");
        setTitle("POST");
        break;
      case "Nombre_Requete_GET":
        setMethode("GET");
        setTitle("GET");
        break;
      case "Nombre_Requete_DELETE":
        setMethode("DELETE");
        setTitle("DELETE");
        break;
      case "Nombre_Requete_PUT":
        setMethode("PUT");
        setTitle("PUT");
        break;

      case "Nombre_Requete_TOTAL":
        setMethode("request_counts");
        setTitle("Nombre de requêtes total")
        break;
      case "Temps_Reponse_Moyen":
        setMethode("average_response_time");
        setTitle("Temps de réponse  moyen");
        break;
      case "Server_Status":
        setMethode("server_status");
        setTitle("Status du serveur");
        break;
      default:
        setMethode("");
        setTitle("");

    }
  }, [type]);

  const renderIcon = (type) => {
    switch (type) {
      case "Nombre_Requete_TOTAL":
        return (
          <FunctionsIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green"
            }}
          />
        );

      case "Temps_Reponse_Moyen":
        return (
          <HourglassEmptyIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green"
            }}
          />
        );
      case "Nombre_Requete_POST":
        return (
          <AddIcon 
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green"
            }}
          />
        );
      case "Nombre_Requete_GET":
        return (
          <SearchIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        );

      case "Nombre_Requete_PUT":
        return (
          <EditIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        );

      case "Nombre_Requete_DELETE":
        return (
          <DeleteIcon 
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        );

      case "Server_Status":
        return (
          <StorageIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        );
      default:
        return null;
    }
  };

  if (!stats) return null;

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title}</span>
        <span className="counter">{stats[methode]}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
        </div>
        {renderIcon(type)}
      </div>
    </div>
  );
};

export default Widget;
