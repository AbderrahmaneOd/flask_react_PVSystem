import config from "../../config.json";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ListModels.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ListModels = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [models, setModels] = useState([]);
  const [modelToDelete, setModelToDelete] = useState(null);

  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.apiUrl}/getAllModels`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModels(res.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (modelName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiUrl}/deleteModel?modele=${modelName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModels(models.filter((model) => model.modelName !== modelName));
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };
  

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="posts">
          <div className="container">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/models/new")}
                className="btn btn-primary mb-4"
              >
                Nouveau Modèle
              </button>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Nom du Modèle</th>
                  <th>Taille du Fichier</th>
                  <th>Date d'Ajout</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.modelName}>
                    <td>{model.modelName}</td>
                    <td>{model.fileSize.value} {model.fileSize.unit}</td>
                    <td>{model.dateAdded}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/models/${model.modelName}`)}
                        className="btn btn-info btn-update"
                      >
                        Modifier
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(model.modelName)}
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

export default ListModels;
