import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsTable = () => {
    const [selectedField, setSelectedField] = useState('');
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/statistics');
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, []);

    const handleFieldChange = (event) => {
        setSelectedField(event.target.value);
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Statistics Table</h2>
            <div className="flex items-center mb-4">
                <label htmlFor="field-select" className="mr-2">Select Field</label>
                <select
                    id="field-select"
                    value={selectedField}
                    onChange={handleFieldChange}
                    className="border border-gray-300 rounded-md py-2 px-4"
                >
                    <option value="">Select Field</option>
                    {statistics && Object.keys(statistics).map(fieldName => (
                        <option key={fieldName} value={fieldName}>{fieldName}</option>
                    ))}
                </select>
            </div>
            {selectedField && statistics && (
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Statistic</th>
                            <th className="px-4 py-2">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(statistics[selectedField]).map(statisticName => (
                            <tr key={statisticName}>
                                <td className="border px-4 py-2">{statisticName}</td>
                                <td className="border px-4 py-2">{statistics[selectedField][statisticName]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StatisticsTable;
