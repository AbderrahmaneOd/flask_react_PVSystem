import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ChartComponent = () => {
    const [defaultValues, setDefaultValues] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get('http://localhost:5000/NaNvalue');
                const data = response.data;

                const filteredColumns = Object.keys(data).filter(key => data[key] !== 0);                

                // Initialize default values
                const initialValues = {};
                filteredColumns.forEach(key => {
                    initialValues[key] = '';
                });
                setDefaultValues(initialValues);
                setInputValues(initialValues);

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

    const processNaNValues = async () => {
        try {
            const response = await axios.post('http://localhost:5000/process-nanvalues', inputValues);
            console.log(response.data);
            setSuccessMessage(response.data.message);
        } catch (error) {
            console.error('Error processing NaN values:', error);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">NaN values</h2>
            <div>
                <table className='border-1 border-gray-300'>
                    {Object.keys(defaultValues).map(columnName => (
                        <tbody >
                            <tr key={columnName}>
                                <td className="border-0"> 
                                    <label htmlFor={columnName}>{columnName}</label>
                                </td>
                                <td className="border-0">
                                    <input
                                        type="text"
                                        value={inputValues[columnName]}
                                        onChange={(e) => handleInputValueChange(columnName, e.target.value)}
                                        className="border border-gray-400 rounded-md"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                {defaultValues && ( // Check if defaultValues is not falsy
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

export default ChartComponent;