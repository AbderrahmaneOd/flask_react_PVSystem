import config from "../../config.json";
import { useState, useEffect } from "react";
import axios from "axios";
import "./ScriptForm.css";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ScriptForm = () => {
  const navigate = useNavigate();
  const { scriptName } = useParams();
  const [script, setScript] = useState({
    scriptName: "",
    file: null,
  });
  const { isAdmin, isManager } = useAuth();
  const basePath = isAdmin ? "/admin/listScripts" : isManager ? "/manager/listScripts" : "";
  useEffect(() => {
    if (scriptName && scriptName !== "new") {
      const fetchScript = async () => {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get(`${config.apiUrl}/getScript?script=${scriptName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setScript(data);
        } catch (error) {
          console.error("Error fetching script:", error);
        }
      };
      fetchScript();
    }
  }, [scriptName]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setScript((prevState) => ({
      ...prevState,
      [name]: name === 'file' ? files[0] : value,
    }));
    console.log('Updated script state:', script);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('scriptName', script.scriptName);
      formData.append('file', script.file);

      console.log('Submitting form with the following data:');
      console.log('Script Name:', script.scriptName);
      console.log('File:', script.file);

      const token = localStorage.getItem('token');
      if (scriptName === "new") {
        const response = await axios.post(`${config.apiUrl}/uploadScript`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data === 'Le nom du script existe déjà. Veuillez choisir un autre nom.') {
          alert(response.data);
          return;
        }
      } else {
        const response = await axios.put(`${config.apiUrl}/updateScript?script=${scriptName}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Update response:', response);

        if (response.status !== 200) {
          alert('Failed to update script');
          return;
        }
      }
      navigate(basePath);
    } catch (error) {
      console.error("Error submitting form:", error);
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
                placeholder="Nom du script..."
                name="scriptName"
                value={script.scriptName}
                onChange={handleChange}
              />
              <input
                type="file"
                accept=".py"
                name="file"
                onChange={handleChange}
              />
              <button onClick={handleSubmit} className="btn btn-primary">
                {scriptName === "new" ? "Créer le script" : "Mettre à jour le script"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptForm;
