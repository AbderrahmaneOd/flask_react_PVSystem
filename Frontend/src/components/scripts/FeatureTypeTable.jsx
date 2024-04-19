import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTypeTable = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/data/type');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching missing rows:', error);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Data Description</h2>
            <table className="min-w-max divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(data).map(([columnName, type], index) => (
                        <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap">{columnName}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTypeTable;
