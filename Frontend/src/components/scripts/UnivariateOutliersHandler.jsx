import React, { useState } from 'react';
import axios from 'axios';

const OutliersHandler = () => {
    const [selectedColumn, setSelectedColumn] = useState('');
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleColumnSelect = (e) => {
        setSelectedColumn(e.target.value);
    };

    const handleMaxValue = (e) => {
        setMaxValue(e.target.value);
    };

    const handleMinValue = (e) => {
        setMinValue(e.target.value);
    };

    const handleOutliers = async () => {
        try {
            const dataToSend = {
                selectedColumn: selectedColumn,
            };
            
            // Only include Min value if it's provided
            if (minValue) {
                dataToSend.min = minValue;
            }
            
            // Only include Max value if it's provided
            if (maxValue) {
                dataToSend.max = maxValue;
            }

            //console.log(dataToSend);

            const response = await axios.post('http://localhost:5000/process/drop_outliers', dataToSend);

            setSuccessMessage(response.data.message);
            setTimeout(() => setSuccessMessage(''), 5000);

        } catch (error) {
            console.error('Error:', error);
            setError('Error processing');
            setTimeout(() => setError(''), 4000);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Univariate Outliers Handler</h2>
            <div>
                <label htmlFor="field-select" className="mr-2">Select Column</label>
                <select onChange={handleColumnSelect} value={selectedColumn}>
                    <option value="">Select</option>
                    <option value="Weather_Temperature_Celsius">Weather Temperature Celsius</option>
                    <option value="Weather_Relative_Humidity">Weather Relative Humidity</option>
                    <option value="Global_Horizontal_Radiation">Global Horizontal Radiation</option>
                    <option value="Weather_Daily_Rainfall">Weather Daily Rainfall</option>
                </select>
            </div>

            {/* Conditionally render Min and Max inputs */}
            {selectedColumn && (
                <div className="flex items-center mt-4">
                    <label htmlFor="min-value" className="mr-2">Min Value</label>
                    <input
                        type="number"
                        id="min-value"
                        value={minValue}
                        onChange={handleMinValue}
                        className="border rounded-md py-2 px-4"
                    />

                    <label htmlFor="max-value" className="ml-4 mr-2">Max Value</label>
                    <input
                        type="number"
                        id="max-value"
                        value={maxValue}
                        onChange={handleMaxValue}
                        className="border rounded-md py-2 px-4"
                    />
                </div>
            )}

            <div className="mt-4">
                <button onClick={handleOutliers} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>
            </div>

            {successMessage && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
        </div>
    );
};

export default OutliersHandler;
