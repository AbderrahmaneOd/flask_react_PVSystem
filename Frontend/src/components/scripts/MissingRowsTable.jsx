import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MissingRowsTable = () => {
    const [missingRows, setMissingRows] = useState([]);
    const [selectedActions, setSelectedActions] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/detect_missing_rows');
            setMissingRows(response.data);
        } catch (error) {
            console.error('Error fetching missing rows:', error);
        }
    };


    const handleActionChange = (timestamp, action) => {
        setSelectedActions({ ...selectedActions, [timestamp]: action });
    };


    const processMissingRows = async () => {
        try {
            const dataToSendd = missingRows.map(row => ({
                timestamp: `${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}:00`, // Combine fields to create timestamp
                version: row.version,
                action: selectedActions[`${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}`]
            }));

            const dataToSend = missingRows.map(row => ({
                timestamp: `${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}:00`,
                version: row.version,
                action: selectedActions[`${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}`]
            })).filter(row => row.action); // Filter out rows with empty or undefined action

            if (dataToSend.length === 0) {
                //console.log('No rows to process');
                setError('No rows to process');
                const timeoutId = setTimeout(() => setError(''), 2000);
                return () => clearTimeout(timeoutId);
            }


            console.log(dataToSend);
            const response = await axios.post('http://localhost:5000/process/missing-rows', dataToSend);
            console.log(response.data);

            // Handle success message
            setSuccessMessage(response.data.message);
        } catch (error) {
            console.error('Error processing missing rows:', error);
            // Handle error message
            setError('Error processing missing rows');
            const timeoutId = setTimeout(() => setError(''), 2000);
            return () => clearTimeout(timeoutId);
        }

    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Missing Rows</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hour</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minute</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {missingRows.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Year}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Month}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Day}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Hour}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Minute}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.version}</td>
                            <td>
                                <select value={selectedActions[`${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}`]} onChange={(e) => handleActionChange(`${row.Year}-${row.Month}-${row.Day} ${row.Hour}:${row.Minute}`, e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="forwardFill">Forward Fill</option>
                                    <option value="backwardFill">Backward Fill</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {missingRows && (
                missingRows.length !== 0
            ) && (
                    <div className="mt-4">
                        <button onClick={processMissingRows} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>
                    </div>
                )}

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

export default MissingRowsTable;