import React, { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import config from "../../config.json";
const MemoryChart = () => {
    const [memoryData, setMemoryData] = useState({ labels: [], data: [] });
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchMemoryData = async () => {
            const response = await fetch(`${config.apiUrl}/etat_memory`);
            const data = await response.json();
            setMemoryData(formatData(data)); // Formatage des données de mémoire
        };

        fetchMemoryData();
    }, []);

    // Fonction pour formater les données de timestamp en heures lisibles
    const formatData = (data) => {
        const formattedData = {
            labels: data.labels.map(timestamp => {
                const date = new Date(timestamp);
                return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`; // Format HH:MM
            }),
            data: data.data
        };
        return formattedData;
    };

    useEffect(() => {
        if (memoryData.labels.length > 0 && memoryData.data.length > 0 && chartRef.current && typeof ApexCharts !== 'undefined') {
            chartRef.current.updateSeries([{
                name: 'Utilisation de la mémoire (%)',
                data: memoryData.data,
                color: '#FF6384'
            }]);
            chartRef.current.updateOptions({
                xaxis: {
                    categories: memoryData.labels
                }
            });
        }
    }, [memoryData]);

    useEffect(() => {
        if (!chartRef.current) {
            chartRef.current = new ApexCharts(document.getElementById("memory-chart"), {
                series: [{
                    name: 'Utilisation de la mémoire (%)',
                    data: memoryData.data,
                    color: '#FF6384'
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    fontFamily: 'Inter, sans-serif',
                    dropShadow: {
                        enabled: false
                    }
                },
                xaxis: {
                    categories: memoryData.labels,
                    labels: {
                        formatter: function (value) {
                            return value;
                        }
                    }
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return value + '%';
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                }
            });
            chartRef.current.render();
        }
    }, []);

    return (
        <div>
            <div id="memory-chart"></div>
        </div>
    );
};

export default MemoryChart;
