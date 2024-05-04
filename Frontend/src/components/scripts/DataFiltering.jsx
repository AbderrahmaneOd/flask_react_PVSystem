import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFiltering = () => {
    const [selectedColumn, setSelectedColumn] = useState('');
    const [deletionCriteria, setDeletionCriteria] = useState('');
    const [uniqueValues, setUniqueValues] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
    }, []);

    const handleColumnSelect = async (event) => {
        const selectedValue = event.target.value;
        setSelectedColumn(selectedValue);
        if (selectedValue) { // Check if selected value is not empty
            try {
                const response = await axios.get(`http://localhost:5000/getUniqueValues/${selectedValue}`);
                setUniqueValues(response.data.uniqueValues);
            } catch (error) {
                console.error('Error fetching unique values:', error);
            }
        } else {
            setUniqueValues([]);
        }
    };

    const handleDeletionCriteriaChange = (event) => {
        setDeletionCriteria(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Prepare data to send
            const dataToSend = {
                selectedColumn: selectedColumn,
                deletionCriteria: deletionCriteria
            };

            console.log(dataToSend);

            const response = await axios.post('http://localhost:5000/process/filtering', dataToSend);

            // Handle success message
            setSuccessMessage(response.data.message);
            const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error processing:', error);

            // Handle error message
            setError('Error processing');
            const timeoutId = setTimeout(() => setError(''), 2000);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Data Filtering</h2>
            <div className="flex flex-wrap items-center rounded-lg p-4">
                <div className="mr-4">
                    <label htmlFor="field-select" className="mr-2 mb-2">Select Columns</label>
                    <select onChange={handleColumnSelect} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500 w-full">
                        <option value="">Select</option>
                        <option value="version">Version</option>
                        <option value="technology">Technology</option>
                        <option value="manuf">Manufacturer</option>
                    </select>
                </div>

                {selectedColumn && (
                    <div>
                        <label className="mr-2 mb-2">Delete based on </label>
                        <select value={deletionCriteria} onChange={handleDeletionCriteriaChange} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500 ml-3 w-full">
                            <option value="">Select</option>
                            {uniqueValues.map((value, index) => (
                                <option key={index} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button onClick={handleSubmit} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>
            </div>

            {successMessage && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default DataFiltering;
