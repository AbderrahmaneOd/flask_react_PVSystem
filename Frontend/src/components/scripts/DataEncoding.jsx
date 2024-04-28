import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataEncoding = () => {
    const [selectedColumn, setselectedColumn] = useState('');
    const [columns, setColumns] = useState([]);
    const [encodingStrategy, setEncodingStrategy] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/categorical/columns');
            const data = await response.json();
            //console.log(data);
            setColumns(data.columns);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    // Function to handle column selection
    const handleColumnSelect = (e) => {
        const { value } = e.target;
        setselectedColumn(...selectedColumn, value);
    };

    // Function to handle normalization strategy selection
    const handleStrategySelect = (e) => {
        const { value } = e.target;
        setEncodingStrategy(value);
    };

    const handleEncode = async () => {
        try {

            // Prepare data to send
            const dataToSend = {
                selectedColumn: selectedColumn,
                encodingStrategy: encodingStrategy,
            };

            console.log(dataToSend);

            const response = await axios.post('http://localhost:5000/process/encode', dataToSend);

            
            
            // Handle success message
            setSuccessMessage(response.data.message);
            const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timeoutId);
        
        } catch (error) {
            console.error('Error encoding data:', error);
            
            // Handle error message
            setError('Error processing');
            const timeoutId = setTimeout(() => setError(''), 2000);
            return () => clearTimeout(timeoutId);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Data Encoding</h2>
            <div>
                <label htmlFor="field-select" className="mr-2">Select Columns to Encode</label>
                <select onChange={handleColumnSelect}>
                    <option value="">Select</option>
                    {columns.map((columnName, index) => (

                        <option key={columnName} value={columnName}>{columnName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="field-select" className="mr-2">Select Strategy</label>
                <select onChange={handleStrategySelect}>
                    <option value="">Select Strategy</option>
                    <option value="labelEncoding">Label Encoding</option>
                    <option value="oneHotEncoding">One-Hot Encoding</option>
                </select>
            </div>
            <div className="mt-4">
                <button onClick={handleEncode} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>
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

export default DataEncoding;