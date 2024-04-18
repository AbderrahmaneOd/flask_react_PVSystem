import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NaNvalueHandler = () => {
    const [defaultValues, setDefaultValues] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [fillMethods, setFillMethods] = useState({}); // State to store fill methods for each column
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get('http://localhost:5000/NaNvalue');
                const data = response.data;

                const filteredColumns = Object.keys(data).filter(key => data[key] !== 0);

                // Initialize default values and fill methods
                const initialValues = {};
                const initialFillMethods = {};
                filteredColumns.forEach(key => {
                    initialValues[key] = '';
                    initialFillMethods[key] = '';
                });
                setDefaultValues(initialValues);
                setInputValues(initialValues);
                setFillMethods(initialFillMethods);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const handleInputValueChange = (columnName, value) => {
        setInputValues({
            ...inputValues,
            [columnName]: value
        });
    };

    const handleFillMethodChange = (columnName, method) => {
        setFillMethods({
            ...fillMethods,
            [columnName]: method
        });
    };

    const processNaNValues = async () => {
        try {
            const response = await axios.post('http://localhost:5000/process/nanvalues', inputValues);
            console.log(response.data);
            setSuccessMessage(response.data.message);
            //console.log(inputValues);
        } catch (error) {
            console.error('Error processing NaN values:', error);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">NaN values</h2>
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constant Value</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean/Median/Mode</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forward Fill/Backward Fill</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deletion</th>
                        </tr>
                    </thead>
                    {Object.keys(defaultValues).map(columnName => (
                        <tbody  key={columnName} className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border-0">
                                    <label htmlFor={columnName}>{columnName}</label>
                                </td>
                                <td className="border-0">
                                    <input
                                        type="text"
                                        value={inputValues[columnName]}
                                        onChange={(e) => handleInputValueChange(columnName, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select value={fillMethods[columnName]} onChange={(e) => handleFillMethodChange(columnName, e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="mean">Mean</option>
                                        <option value="median">Median</option>
                                        <option value="mode">Mode</option>
                                    </select>
                                </td>
                                <td>
                                    <select value={fillMethods[columnName]} onChange={(e) => handleFillMethodChange(columnName, e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="forwardFill">Forward Fill</option>
                                        <option value="backwardFill">Backward Fill</option>
                                    </select>
                                </td>
                                <td>
                                    <select value={fillMethods[columnName]} onChange={(e) => handleFillMethodChange(columnName, e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="deleteRow">Delete Row</option>
                                        <option value="deleteColumn">Delete Column</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                {defaultValues && (
                    Object.keys(defaultValues).length !== 0
                ) && (
                        <div className="mt-4">
                            <button onClick={processNaNValues} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Process</button>
                        </div>
                    )}


                {successMessage && (
                    <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> {successMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NaNvalueHandler;
