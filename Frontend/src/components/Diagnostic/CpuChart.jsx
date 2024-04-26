import React, { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import config from "../../config.json";
const CpuChart = () => {
    const [cpuData, setCpuData] = useState({ labels: [], data: [] });
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchCpuData = async () => {
            const response = await fetch(`${config.apiUrl}/etat_cpu`);
            const data = await response.json();
            setCpuData(formatData(data)); // Formatage des données CPU
        };

        fetchCpuData();
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
        if (cpuData.labels.length > 0 && cpuData.data.length > 0 && chartRef.current && typeof ApexCharts !== 'undefined') {
            chartRef.current.updateSeries([{
                name: 'Utilisation du CPU (%)',
                data: cpuData.data,
                color: '#4CAF50'
            }]);
            chartRef.current.updateOptions({
                xaxis: {
                    categories: cpuData.labels
                }
            });
        }
    }, [cpuData]);

    useEffect(() => {
        if (!chartRef.current) {
            chartRef.current = new ApexCharts(document.getElementById("cpu-chart"), {
                series: [{
                    name: 'Utilisation du CPU (%)',
                    data: cpuData.data,
                    color: '#4CAF50'
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
                    categories: cpuData.labels,
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
            <div id="cpu-chart"></div>
        </div>
    );
};

export default CpuChart;
