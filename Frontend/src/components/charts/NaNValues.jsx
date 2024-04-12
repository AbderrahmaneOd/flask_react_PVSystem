import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const ChartComponent = () => {
    const [defaultValues, setDefaultValues] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '% NaN Values ',
                data: [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
            },
        ],
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/NaNvalue');

                const data = response.data;

                //console.log(data);
                //console.log("Test");

                const filteredColumns = Object.keys(data).filter(key => data[key] !== 0);

                setChartData({
                    labels: Object.keys(data),
                    datasets: [
                        {
                            label: '%NaN Values',
                            data: Object.values(data),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }
                    ]
                });

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
        } catch (error) {
            console.error('Error processing NaN values:', error);
        }
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">NaN values</h2>
            <div>
                {Object.keys(defaultValues).map(columnName => (
                    <div key={columnName} className="mb-2">
                        <label htmlFor={columnName} className="mr-2">{columnName}:</label>
                        <input
                            type="text"
                            value={inputValues[columnName]}
                            onChange={(e) => handleInputValueChange(columnName, e.target.value)}
                            className="border border-gray-400 rounded-md p-1 ml-2"
                        />
                    </div>
                ))}
                <div className="mt-4">
                    <button onClick={processNaNValues} className="bg-blue-500 text-white px-4 py-2 rounded-md">Process NaN Values</button>
                </div>
            </div>

            <div>
                <Bar
                    data={chartData}
                />
            </div>
        </div>
    );


};

export default ChartComponent;
