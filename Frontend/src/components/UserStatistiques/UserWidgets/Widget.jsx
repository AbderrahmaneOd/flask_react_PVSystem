import React, { useState, useEffect } from "react";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./widget.scss";
import config from "../../../config.json";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FunctionsIcon from '@mui/icons-material/Functions';

const Widget = ({ type }) => {
  const [stats, setStats] = useState(null);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.apiUrl}/users/count-by-role`, {
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
      case "Nombre_Admin":
        setTitle("Nombre d'admin");
        setPost("admin")
        break;
      case "Nombre_Responsable_ai":
        setPost("responsableAi")
        setTitle("Nombre de Responsable AI");
        break;
      case "Nombre_Chercheur":
        setPost("researcher")
        setTitle("Nombre de chercheur");
        break;
      case "Nombre_Utilisateur_Totale":
        setPost("total_users")
        setTitle("Nombre total d'utilisateurs");
        break;
      case "Nombre_Models":
        setPost("model_count")
        setTitle("Modèles disponibles");
        break;

      default:
        setPost("admin")

        setTitle("");
    }
  }, [type]);

  const renderIcon = (type) => {
    switch (type) {
      case "Nombre_Admin":
      case "Nombre_Chercheur":
      case "Nombre_Responsable_ai":
        return (
          <PersonOutlineIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green"
            }}
          />
        );
      case "Nombre_Utilisateur_Totale":
        return (
          <FunctionsIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green"
            }}
          />
        );
      case "Nombre_Models":
        return (
          <EmojiObjectsIcon
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
        <span className="counter">{stats[post]}</span>
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
