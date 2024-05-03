import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataReduction = () => {
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [firstColumn, setFirstColumn] = useState('');
    const [secondColumn, setSecondColumn] = useState('');
    const [operator, setOperator] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/numeric/columns');
            const data = await response.json();
            setColumns(data.columns);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    const handleColumnSelect = (e) => {
        setSelectedColumn(e.target.value);
    };

    const handleFirstColumnSelect = (e) => {
        setFirstColumn(e.target.value);
    };

    const handleSecondColumnSelect = (e) => {
        setSecondColumn(e.target.value);
    };

    const handleOperatorChange = (e) => {
        setOperator(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const dataToSend = {
                selectedColumn: selectedColumn,
                firstColumn: firstColumn,
                secondColumn: secondColumn,
                operator: operator
            };

            //console.log(dataToSend);

            const response = await axios.post('http://localhost:5000/process/column/merging', dataToSend);

            setSuccessMessage(response.data.message);
            const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);

        } catch (error) {
            console.error('Error processing:', error);
            setError('Error processing');
            const timeoutId = setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Data Reduction</h2>
            <div className="flex flex-wrap items-center rounded-lg p-4">
                <div className="mb-4 mr-4">
                    <select id="columnSelect" onChange={handleColumnSelect} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500">
                        <option value="">Select Column</option>
                        {columns.map((columnName, index) => (
                            <option key={index} value={columnName}>{columnName}</option>
                        ))}
                    </select>
                </div>

                <span className="text-gray-500 text-2xl font-bold pb-4 mr-4">=</span>

                <div className="mb-4 mr-4">
                    <select id="firstColumnSelect" onChange={handleFirstColumnSelect} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500">
                        <option value="">Select First Column</option>
                        {columns.map((columnName, index) => (
                            <option key={index} value={columnName}>{columnName}</option>
                        ))}
                    </select>
                </div>



                <div className="mb-4 mr-4">
                    <select value={operator} onChange={handleOperatorChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500">
                        <option value="">Operator</option>
                        <option value="/">/</option>
                        <option value="*">*</option>
                    </select>
                </div>

                <div className="mb-4">
                    <select id="secondColumnSelect" onChange={handleSecondColumnSelect} className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500">
                        <option value="">Select Second Column</option>
                        {columns.map((columnName, index) => (
                            <option key={index} value={columnName}>{columnName}</option>
                        ))}
                    </select>
                </div>
            </div>


            <button onClick={handleSubmit} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>

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

export default DataReduction;
