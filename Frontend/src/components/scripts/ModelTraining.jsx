import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelTraining = () => {
    const [columns, setColumns] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);

    useEffect(() => {
        fetchColumns();
    }, []);

    const fetchColumns = async () => {
        try {
            const response = await fetch('http://localhost:5000/columns');
            const data = await response.json();
            setColumns(data.columns);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    // Function to handle column selection
    const handleColumnSelect = (e) => {
        const { value } = e.target;
        //setselectedColumn(...selectedColumn, value);
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

    const handleTraining = () => {
        setLoading(true); // Set loading state to true when training starts
        console.log("Training model:", selectedModel);

        // Simulate training delay (remove setTimeout in actual implementation)
        setTimeout(() => {
            setLoading(false); // Set loading state to false when training completes
            console.log("Training completed!");
            setSuccessMessage("Training completed!");
            const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);
        }, 5000); // Simulate training for 2 seconds
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Model Training</h2>
            <div className="mb-4 mr-4">
                <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    className="mr-4 border border-gray-300 rounded"
                >
                    <option value="">Select Model</option>
                    {models.map(model => (
                        <option key={model.modelName} value={model.modelName}>{model.modelName}</option>
                    ))}
                </select>

                <button onClick={handleTraining} disabled={!selectedModel || loading} className={`hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {loading ? (
                        <div className="flex items-center">
                            <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                            <span>Training...</span>
                        </div>
                    ) : (
                        <span>Train</span>
                    )}
                </button>
            </div>

            {successMessage && (
                <div className="mt-4 px-4 py-3 mb-3 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            {selectedModel && (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {models.map(model => (
                            Array.from({ length: model.numberParametres }, (_, index) => (
                                <tr key={`${model.modelName}-${index}`}>
                                    <td className="px-6 py-3 whitespace-nowrap">Parameter {index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <select onChange={handleColumnSelect} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500">
                                            <option value="">Select</option>
                                            {columns.map((columnName, columnIndex) => (
                                                <option key={columnName} value={columnName}>{columnName}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};

export default ModelTraining;
