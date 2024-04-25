import config from "../../config.json";
import { useState, useEffect } from "react";
import axios from "axios";
import "./ModelForm.css";
import { useNavigate, useParams } from "react-router-dom";

const ModelForm = () => {
  const navigate = useNavigate();
  const { modelName } = useParams();
  const [model, setModel] = useState({
    modelName: "",
    file: null,
  });

  useEffect(() => {
    if (modelName && modelName !== "new") {
      const fetchModel = async () => {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get(`${config.apiUrl}/getModel?modele=${modelName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setModel(data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchModel();
    }
  }, [modelName]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setModel((prevState) => ({
      ...prevState,
      [name]: name === 'file' ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('modelName', model.modelName);
      formData.append('file', model.file);
      
      const token = localStorage.getItem('token'); 
      if (modelName === "new") {
        const response = await axios.post(`${config.apiUrl}/uploadModel`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Vérification si le nom du modèle existe déjà
        if (response.data === 'Le nom du modèle existe déjà. Veuillez choisir un autre nom.') {
          // Afficher un message d'erreur à l'utilisateur
          alert(response.data);
          return; // Arrêter l'exécution de la fonction handleSubmit
        }
      } else {
        await axios.put(`${config.apiUrl}/updateModel?modelName=${modelName}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate("/admin/Listmodels");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="post__wrapper">
          <div className="container">
            <form className="post">
              <input
                type="text"
                placeholder="Nom du modèle..."
                name="modelName"
                value={model.modelName}
                onChange={handleChange}
              />
              <input
                type="file"
                accept=".h5"
                name="file"
                onChange={handleChange}
              />
              <button onClick={handleSubmit} className="btn btn-primary">
                {modelName === "new" ? "Créer le modèle" : "Mettre à jour le modèle"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelForm;
