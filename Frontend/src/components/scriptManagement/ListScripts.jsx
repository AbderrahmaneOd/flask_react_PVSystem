import config from "../../config.json";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ListScripts.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ListScripts = () => {
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [scripts, setScripts] = useState([]);

  const fetchScripts = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/getAllScripts`);
      setScripts(res.data);
    } catch (error) {
      console.error("Error fetching scripts:", error);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleDelete = async (scriptName) => {
    try {
      await axios.delete(`${config.apiUrl}/deleteScript?script=${scriptName}`);
      setScripts(scripts.filter((script) => script.scriptName !== scriptName));
    } catch (error) {
      console.error("Error deleting script:", error);
    }
  };

  // Déterminez le chemin de base en fonction du rôle de l'utilisateur
  const basePath = isAdmin ? "/admin/scripts" : isManager ? "/manager/scripts" : "";

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="posts">
          <div className="container">
            {(isAdmin || isManager) && (
              <button
                onClick={() => navigate(`${basePath}/new`)} // Utilisez le chemin de base pour créer un nouveau script
                className="btn btn-primary mb-4"
              >
                Nouveau Script
              </button>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Nom du Script</th>
                  <th>Taille du Fichier</th>
                  <th>Date d'Ajout</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((script) => (
                  <tr key={script.scriptName}>
                    <td>{script.scriptName}</td>
                    <td>{script.scriptSize.value} {script.scriptSize.unit}</td>
                    <td>{script.dateAdded}</td>
                    <td>
                      <button
                        onClick={() => navigate(`${basePath}/${script.scriptName}`)} // Utilisez le chemin de base pour afficher le script
                        className="btn btn-info btn-update"
                      >
                        Modifier
                      </button>
                      {(isAdmin || isManager) && (
                        <button
                          onClick={() => handleDelete(script.scriptName)}
                          className="btn btn-danger btn-delete"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListScripts;
