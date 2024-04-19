import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MissingRowsTable = () => {
    const [missingRows, setMissingRows] = useState([]);

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MissingRowsTable;
