import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelEvaluation = () => {
    const [data, setData] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');

    useEffect(() => {

    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/model/score');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching missing rows:', error);
        }
    };
    
    useEffect(() => {
        // Effectue la requête pour récupérer les modèles depuis l'API
        axios.get("http://localhost:5000/getAllModels")
          .then(response => {
            // Met à jour l'état avec les modèles récupérés depuis l'API
            setModels(response.data);
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des modèles :", error);
          });
      }, []); // Exécuté uniquement une fois après le montage du composant
    
      const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
      };

    const handlePredict = () => {
        fetchData();
        console.log("Prédiction pour le modèle :", selectedModel);

    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Prediction</h2>
            <div>
                <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    className="mr-4 px-5 py-1 border border-gray-300 rounded"
                >
                    <option value="">Select Model</option>
                    {models.map(model => (
                        <option key={model.modelName} value={model.modelName}>{model.modelName}</option>
                    ))}
                </select>
                <button onClick={handlePredict} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Predict
                </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(data).map((key) => (
                        <tr key={key}>
                            <td className="px-6 py-3 whitespace-nowrap">{key}</td>
                            <td className="px-6 py-3 whitespace-nowrap">{data[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModelEvaluation;
